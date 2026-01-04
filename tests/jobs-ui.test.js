/* tests/jobs-ui.test.js */

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// Load the *browser* jQuery build from your lib folder
const jquerySource = fs.readFileSync(
    path.resolve(__dirname, "../lib/jquery-3.7.0.min.js"),
    "utf-8"
);

// Create DOM
const dom = new JSDOM(
    "<!doctype html><html><body><table id='jobs-table'></table><div id='jobs-details'></div></body></html>",
    { runScripts: "dangerously" }
);

// Inject jQuery into the DOM
dom.window.eval(jquerySource);

// Extract jQuery instance
const $ = dom.window.jQuery;

// Make global for DataTables + your code
global.window = dom.window;
global.document = dom.window.document;
global.$ = $;
global.jQuery = $;

// Verify jQuery initialized correctly
if (!$.fn) {
    throw new Error("jQuery failed to initialize — $.fn is undefined");
}

// Minimal DataTable stub
$.fn.DataTable = function (options) {
    this.data("dt-options", options || {});
    return {
        row: (tr) => ({
            index: () => $(tr).index()
        })
    };
};

// Load JobsCore FIRST
const JobsCore = require("../src/core/jobs-core.js");
global.JobsCore = JobsCore;

// Now load JobsUI (which depends on JobsCore)
const JobsUI = require("../src/ui/jobs-ui.js");

describe("JobsApp.UI.init", function () {
    it("initializes DataTable on the given table", function () {
        const jobs = [
            {
                id: 1,
                notice_num: "JOB-001",
                announcement_date: "2025-01-01",
                command_location: "HQ",
                grade: "GS-12",
                position: "Analyst",
                details: "Details"
            }
        ];

        JobsUI.init({
            tableSelector: "#jobs-table",
            jobs: jobs,
            detailsContainerSelector: "#jobs-details"
        });

        const dtOptions = $("#jobs-table").data("dt-options");

        expect(dtOptions.columns.length).toBe(5);
        expect(dtOptions.data.length).toBe(1);
    });
});
