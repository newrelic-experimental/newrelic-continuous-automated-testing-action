import * as core from "@actions/core";
import { SummaryTableRow } from "@actions/core/lib/summary";
import { ContinuousAutomatedTestingResults } from "@newrelic/continuous-automated-testing/dist/lib/interfaces";

export async function buildSummary(
  testResults: ContinuousAutomatedTestingResults
) {
  let countSuccess = 0,
    countFailure = 0;
  const arr: Array<SummaryTableRow> = [];
  arr.push([
    { data: "Monitor Name", header: true },
    { data: "Result", header: true },
    { data: "Is Blocking?", header: true },
    { data: "Result URL", header: true },
    { data: "Overrides", header: true },
    { data: "Error", header: true },
  ]);

  testResults.tests.map((test) => {
    test.result == "SUCCESS" ? countSuccess++ : countFailure++;
    let overridesCount = 0;
    if (test.automatedTestMonitorConfig?.overrides) {
      Object.values(test.automatedTestMonitorConfig?.overrides).forEach(
        (value) => {
          if (value) {
            overridesCount++;
          }
        }
      );
    }

    arr.push([
      test.monitorName,
      test.result == "SUCCESS"
        ? `🟢&nbsp;${test.result}`
        : `🔴&nbsp;${test.result}`,
      test.automatedTestMonitorConfig?.isBlocking?.toString() || "false",
      `<a href=${test.resultsUrl}>View Details</a>`,
      overridesCount.toString(),
      test.error?.toString() || "",
    ]);
  });

  const resultHeader = `
    <div>
      <h5>${countSuccess} passed, ${countFailure} failed, ${
    countSuccess + countFailure
  } total</h5>
    </div>
    `;

  await core.summary
    .addHeading("Results")
    .addHeading(resultHeader, 5)
    .addTable(arr)
    .addLink("View detailed test results", testResults.batchUrl)
    .write();
  return arr;
}
