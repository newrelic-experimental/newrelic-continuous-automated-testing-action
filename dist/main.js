"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const fs_1 = __importDefault(require("fs"));
const continuous_automated_testing_1 = require("@newrelic/continuous-automated-testing");
const buildSummary_1 = require("./buildSummary");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRelicApiKey = core.getInput("new_relic_api_key", {
                required: true,
            });
            const configFilePath = core.getInput("config_file_path", {
                required: true,
            });
            const confFile = fs_1.default.readFileSync(configFilePath);
            const automatedTestConfig = JSON.parse(confFile.toString());
            const testResults = yield (0, continuous_automated_testing_1.runTestBatch)(newRelicApiKey, automatedTestConfig);
            yield (0, buildSummary_1.buildSummary)(testResults);
            core.setOutput("result", testResults.status);
            core.setOutput("batchId", testResults.batchId);
            core.setOutput("testResults", testResults.tests);
            if ((testResults === null || testResults === void 0 ? void 0 : testResults.status) === "PASSED") {
                core.info("Continous testing complete, tests passed!");
            }
            else {
                core.setFailed("Continous testing complete, tests did not pass!");
            }
        }
        catch (error) {
            console.log(error);
            core.setFailed(error instanceof Error
                ? error.message
                : "Execution of automated tests failed.");
        }
    });
}
exports.run = run;
