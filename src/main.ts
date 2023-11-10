import * as core from "@actions/core";
import fs from "fs";
import { runTestBatch } from "@newrelic/continuous-automated-testing";

import { buildSummary } from "./buildSummary";
import {
  ContinuousTestingConfiguration,
  ContinuousAutomatedTestingResults,
} from "@newrelic/continuous-automated-testing/dist/lib/interfaces";

export async function run(): Promise<void> {
  try {
    const newRelicApiKey: string = core.getInput("new_relic_api_key", {
      required: true,
    });
    const configFilePath: string = core.getInput("config_file_path", {
      required: true,
    });

    const confFile = fs.readFileSync(configFilePath);
    const automatedTestConfig: ContinuousTestingConfiguration = JSON.parse(
      confFile.toString()
    );

    const testResults: ContinuousAutomatedTestingResults | undefined =
      await runTestBatch(newRelicApiKey, automatedTestConfig);

    await buildSummary(testResults);

    if (testResults?.status === "PASSED") {
      core.info("Continous testing complete, tests passed!");
    } else {
      core.setFailed("Continous testing complete, tests did not pass!");
    }
  } catch (error) {
    console.log(error);
    core.setFailed(
      error instanceof Error
        ? error.message
        : "Execution of automated tests failed."
    );
  }
}
