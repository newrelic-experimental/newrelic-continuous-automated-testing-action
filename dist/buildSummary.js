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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSummary = void 0;
const core = __importStar(require("@actions/core"));
function buildSummary(testResults) {
    return __awaiter(this, void 0, void 0, function* () {
        let countSuccess = 0, countFailure = 0;
        const arr = [];
        arr.push([
            { data: "Monitor Name", header: true },
            { data: "Result", header: true },
            { data: "Is Blocking?", header: true },
            { data: "Result URL", header: true },
            { data: "Overrides", header: true },
            { data: "Error", header: true },
        ]);
        testResults.tests.map((test) => {
            var _a, _b, _c, _d, _e;
            test.result == "SUCCESS" ? countSuccess++ : countFailure++;
            let overridesCount = 0;
            if ((_a = test.automatedTestMonitorConfig) === null || _a === void 0 ? void 0 : _a.overrides) {
                Object.values((_b = test.automatedTestMonitorConfig) === null || _b === void 0 ? void 0 : _b.overrides).forEach((value) => {
                    if (value) {
                        overridesCount++;
                    }
                });
            }
            arr.push([
                test.monitorName,
                test.result == "SUCCESS"
                    ? `🟢&nbsp;${test.result}`
                    : `🔴&nbsp;${test.result}`,
                ((_d = (_c = test.automatedTestMonitorConfig) === null || _c === void 0 ? void 0 : _c.isBlocking) === null || _d === void 0 ? void 0 : _d.toString()) || "false",
                `<a href=${test.resultsUrl}>View Details</a>`,
                overridesCount.toString(),
                ((_e = test.error) === null || _e === void 0 ? void 0 : _e.toString()) || "",
            ]);
        });
        const resultHeader = `
    <div>
      <h5>${countSuccess} passed, ${countFailure} failed, ${countSuccess + countFailure} total</h5>
    </div>
    `;
        yield core.summary
            .addHeading("Results")
            .addHeading(resultHeader, 5)
            .addTable(arr)
            .addLink("View detailed test results", testResults.batchUrl)
            .write();
        return arr;
    });
}
exports.buildSummary = buildSummary;
