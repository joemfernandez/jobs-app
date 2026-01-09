/* src/sp/jobs-sp.js */

var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};

JobsApp.DataService = (function () {
  "use strict";

  function create($, JobsCore) {
    if (!$) {
      throw new Error("JobsApp.DataService.create requires jQuery.");
    }
    if (!JobsCore) {
      throw new Error("JobsApp.DataService.create requires JobsCore.");
    }

    function getJobs(url) {
      if (!url) {
        throw new Error("getJobs: url is required.");
      }

      return $.ajax({
        url: url,
        method: "GET",
        dataType: "text"
      }).then(function (raw) {
        return JobsCore.parseJson(raw);
      });
    }

    return {
      getJobs: getJobs
    };
  }

  function notInitialized() {
    throw new Error(
      "JobsApp.DataService has not been initialized. " +
        "Call JobsApp.DataService.create(jQuery, JobsCore) first."
    );
  }

  return {
    create: create,
    getJobs: notInitialized
  };
})();

/* Node export for Jest. */
/* eslint-disable-next-line no-undef */
module.exports = JobsApp.DataService;
