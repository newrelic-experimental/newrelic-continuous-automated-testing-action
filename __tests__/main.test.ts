import * as process from "process";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { run } from "../src/main";
import * as core from "@actions/core";
import * as nrCat from "@newrelic/continuous-automated-testing";
import fs from "fs";
import * as buildSummary from "../src/buildSummary";

jest.mock("@newrelic/continuous-automated-testing");
jest.mock("../src/buildSummary");

const apiKey = "api_key_123";
const configFilePath = "./test/path";
const setFailedMock = jest.spyOn(core, "setFailed");
const runSyntheticsMock = jest.spyOn(nrCat, "runTestBatch");
const readFileSyncMock = jest.spyOn(fs, "readFileSync");
const buildSummaryMock = jest.spyOn(buildSummary, "buildSummary");

const configFileString = JSON.stringify({
  accountId: 123,
  region: "US",
  tests: [{ monitorGUID: "mg123" }],
});

describe("The run method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When required inputs are missing", () => {
    it("Should throw an error when new_relic_api_key input is not supplied", async () => {
      await run();
      expect(setFailedMock).toHaveBeenCalledWith(
        "Input required and not supplied: new_relic_api_key"
      );
    });

    it("Should throw an error when config_file_path input is not supplied", async () => {
      process.env["INPUT_NEW_RELIC_API_KEY"] = "api_key_123";
      await run();
      expect(setFailedMock).toHaveBeenCalledWith(
        "Input required and not supplied: config_file_path"
      );
    });
  });

  describe("When required inputs are present", () => {
    beforeEach(() => {
      console.log("what");
      process.env["INPUT_NEW_RELIC_API_KEY"] = apiKey;
      process.env["INPUT_CONFIG_FILE_PATH"] = configFilePath;
    });

    it("should start a batch of tests", async () => {
      readFileSyncMock.mockReturnValue(configFileString);
      await run();
      expect(runSyntheticsMock).toHaveBeenCalledWith(
        apiKey,
        JSON.parse(configFileString)
      );
      expect(buildSummaryMock).toHaveBeenCalled();
    });
  });
});
