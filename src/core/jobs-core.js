/* src/core/jobs-core.js */
/* global module */

var JobsCore = (function () {
  "use strict";

  /**
   * Represents a single job opening.
   * @typedef {Object} Job
   * @property {number|string} id
   * @property {string} notice_num
   * @property {string} announcement_date
   * @property {string} closing_date
   * @property {string} command_location
   * @property {string} grade
   * @property {string} position
   * @property {string} details - HTML string with job details
   */

  /**
   * Normalize a raw job object into a fully populated Job structure.
   * Ensures all expected fields exist and default to empty strings when missing.
   *
   * @param {Object} item
   * @returns {Job}
   */
  function normalizeJob(item) {
    return {
      id: item.id,
      notice_num: item.notice_num || "",
      announcement_date: item.announcement_date || "",
      closing_date: item.closing_date || "",
      command_location: item.command_location || "",
      grade: item.grade || "",
      position: item.position || "",
      details: item.details || ""
    };
  }

  /**
   * Parse raw JSON text into an array of Job objects.
   *
   * @param {string} rawJsonText
   * @returns {Job[]}
   */
  function parseJson(rawJsonText) {
    if (typeof rawJsonText !== "string") {
      throw new Error("parseJson: rawJsonText must be a string.");
    }

    var data = JSON.parse(rawJsonText);

    if (!Array.isArray(data)) {
      throw new Error("parseJson: JSON root must be an array.");
    }

    return data.map(normalizeJob);
  }

  /**
   * Format a date string. Currently a passthrough with empty-string fallback.
   *
   * @param {string} dateStr
   * @returns {string}
   */
  function formatDate(dateStr) {
    if (!dateStr) {
      return "";
    }
    return dateStr;
  }

  /**
   * Convert a Job into a DataTables row array.
   *
   * @param {Job} job
   * @returns {Array}
   */
  function jobToRow(job) {
    return [
      job.notice_num,
      formatDate(job.announcement_date),
      job.command_location,
      job.grade,
      job.position
    ];
  }

  return {
    parseJson: parseJson,
    formatDate: formatDate,
    jobToRow: jobToRow,
    normalizeJob: normalizeJob // exported for testing
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = JobsCore;
}
