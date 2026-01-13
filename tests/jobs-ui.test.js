/* tests/jobs-ui.test.js */

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// Load browser jQuery source
const jquerySource = fs.readFileSync(
  path.resolve(__dirname, "../lib/jquery-3.7.0.min.js"),
  "utf-8"
);

describe("JobsApp.UI.init", function () {
  let dom, $, JobsCore, JobsUI, instance;

  beforeEach(() => {
    // Fresh DOM for each test
    dom = new JSDOM(
      "<!doctype html><html><body>" +
        "<table id='jobs-table'></table>" +
        "<div id='jobs-details'></div>" +
        "</body></html>",
      { runScripts: "dangerously" }
    );

    // Inject jQuery into DOM
    dom.window.eval(jquerySource);
    $ = dom.window.jQuery;

    // Minimal DataTables stub
    $.fn.DataTable = function (options) {
      this.data("dt-options", options || {});
      return {
        row: (tr) => ({
          index: () => $(tr).index()
        })
      };
    };

    // Mock JobsCore
    JobsCore = {
      jobToRow: jest.fn((job) => [
        job.notice_num,
        job.announcement_date,
        job.command_location,
        job.grade,
        job.position
      ])
    };

    // Load UI module
    JobsUI = require("../src/ui/jobs-ui.js");

    // Create instance with DI
    instance = JobsUI.create($, JobsCore);
  });

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

    const dataTableSpy = jest.spyOn($.fn, "DataTable");

    instance.init({
      tableSelector: "#jobs-table",
      jobs: jobs,
      detailsContainerSelector: "#jobs-details"
    });

    expect(dataTableSpy).toHaveBeenCalledTimes(1);

    const callArgs = dataTableSpy.mock.calls[0][0];

    expect(callArgs.columns.length).toBe(5);
    expect(callArgs.data.length).toBe(1);
  });
});
