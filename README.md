<a href="https://opensource.newrelic.com/oss-category/#new-relic-experimental"><picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/dark/Experimental.png"><source media="(prefers-color-scheme: light)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Experimental.png"><img alt="New Relic Open Source experimental project banner." src="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Experimental.png"></picture></a>

# newrelic-continuous-automated-testing-action
![GitHub forks](https://img.shields.io/github/forks/newrelic-experimental/newrelic-continuous-automated-testing-action?style=social)
![GitHub stars](https://img.shields.io/github/stars/newrelic-experimental/newrelic-continuous-automated-testing-action?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/newrelic-experimental/newrelic-continuous-automated-testing-action?style=social)

![GitHub all releases](https://img.shields.io/github/downloads/newrelic-experimental/newrelic-continuous-automated-testing-action/total)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/newrelic-experimental/newrelic-continuous-automated-testing-action)
![GitHub last commit](https://img.shields.io/github/last-commit/newrelic-experimental/newrelic-continuous-automated-testing-action)
![GitHub Release Date](https://img.shields.io/github/release-date/newrelic-experimental/newrelic-continuous-automated-testing-action)


![GitHub issues](https://img.shields.io/github/issues/newrelic-experimental/newrelic-continuous-automated-testing-action)
![GitHub issues closed](https://img.shields.io/github/issues-closed/newrelic-experimental/newrelic-continuous-automated-testing-action)
![GitHub pull requests](https://img.shields.io/github/issues-pr/newrelic-experimental/newrelic-continuous-automated-testing-action)
![GitHub pull requests closed](https://img.shields.io/github/issues-pr-closed/newrelic-experimental/newrelic-continuous-automated-testing-action)


>A GitHub Action used for calling Synthetics Monitors as a step within a Workflow.  Easily test new functionality, user experience and take action depending on results.

## Inputs

|Name | Required | Description |
|:-:|:-:|:-:|
|new_relic_api_key|true|API Key for your New Relic Account|
|config_file_path|true|Relative path to JSON configuration file for Continuous Automated Testing|

result:
    description: 'Result status of entire test batch'
  batchId:
    description: 'ID of test batch'
  testResults:
    description: 'Results of all individual tests, including configuration information'

### Outputs
|Name | Description |
|:-:|:-:|
|result|Result status of entire test batch|
|batchId|ID of test batch|
|testResults|Results of all individual tests, including configuration information|


## Example Usage

```
name: Run Continuous Automated Tests - workflow

on: 
    workflow_call

jobs:
    deploy:
        name: Run Continuous Automated Tests
        runs-on: ubuntu-latest
        environment: production
    
        steps:
        # This step is used to read the configuration file
        - name: Checkout
          uses: actions/checkout@v3
        
        # This step begins the test batch, taking in a New Relic API Key and path to a configuration file
        - name: Run Test Action
          uses: newrelic-experimental/newrelic-continuous-automated-testing-action@v0.0.3
          with:
            new_relic_api_key: ${{ secrets.NR_API_KEY }}
            config_file_path: .github/workflows/synthetics.config.json

```

## Example Configuration file
>Configuration settings are always optional, see [Configuration Options](#configuration-options) for details about their usage.

```
{
    "accountId": 12345,
    "region": "US",
    "verbose": true,
    "tests": [
        {
            "monitorGuid": "<monitor-guid-1>"
        },
        {
            "monitorGuid": "<monitor-guid-2>",
            "config": {
                "isBlocking": false,
                "overrides": {
                    "location": "AWS_US_EAST_1",
                    "domain": {
                        "domain": "https://example.com",
                        "override": "https://example.org"
                    },
                    "secureCredential": {
                        "key": "apiKey1",
                        "overrideKey": "key-value-2"
                    },
                    "startingUrl": "https://example.com"
                }
            }
        }
    ],
    "config": {
        "batchName": "GitHub Action Example Config"
    }
}
```

## Configuration Options
> All configuration settings are optional, allowing for any level of complexity when setting up a test batch

### Monitor Options
|Name | Description |
|:-:|:-:|
|"isBlocking"|When true, a failure for this monitor will fail the Workflow.  True by default|
|"overrides"|A set of configuration options to override default monitor values|


Location
Secure credentials
Domain for API monitors
Starting URL for browser monitors
### Monitor Override Options
> Add these options to config.overrides in the JSON configuration file, see [the example JSON config](#example-configuration-file)

|Name |Example| Description |
|:-:|:-:|:-:|
|Location|"location": "AWS_US_EAST_1"|Override the location where the monitor will be executed|
|Domain|"domain": {"domain": "https://example.com" "override": "https://example.org"}|Override the domain for API monitors|
|Secure credentials|"secureCredential": {"key": "apiKey1", "overrideKey": "key-value-2"}|Override secured credentials used in the monitor's script|
|startingUrl|"startingUrl": "https://example.com"|Override the starting URL for browser monitors|


### Batch Options
>Config options that affect the entire batch.  Several batch options are set by default when using the Action

|Name | Description |
|:-:|:-:|
|batchName|Name for the batch in the batch details list|
|branch|SCM branch used for the batch, filled in by default when empty or absent|
|commit|SCM commit sha for the batch, filled in by default when empty or absent|
|deepLink||
|platform||
|repository|SCM repository for the batch, filled in by default when empty or absent|

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

>We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.


## Contributing

We encourage your contributions to improve [Project Name]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project. If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License

[Project Name] is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

>[If applicable: [Project Name] also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]