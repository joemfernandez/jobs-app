/* src/sp/jobs-sp.js */
/* global */

var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};

JobsApp.DataService = (function () {
  "use strict";

  /**
   * Factory function that creates a DataService instance.
   *
   * @param {Object} $ - jQuery-like object with an ajax method
   * @param {Object} JobsCore - Core module with parseJson
   * @returns {{ getJobs: function(string): Promise }}
   */
  function create($, JobsCore) {
    if (!$) {
      throw new Error("JobsApp.DataService.create requires jQuery.");
    }
    if (!JobsCore) {
      throw new Error("JobsApp.DataService.create requires JobsCore.");
    }

    /**
     * Load jobs from a URL that returns raw JSON text.
     *
     * @param {string} url
     * @returns {Promise} Resolves with array of Job objects.
     */
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

  // Guard: If someone tries to use DataService without calling create(),
  // they get a clear, intentional error instead of a cryptic TypeError.
  function notInitialized() {
    throw new Error(
      "JobsApp.DataService has not been initialized. " +
        "Call JobsApp.DataService.create(jQuery, JobsCore) first."
    );
  }

  return {
    create: create,
    // Expose a placeholder that throws until create() is called
    getJobs: notInitialized
  };
})();
