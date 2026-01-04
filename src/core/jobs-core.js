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
     * @property {string} details  - HTML string with job details
     */

    /**
     * Parse raw JSON text into an array of Job objects.
     * This function is side-effect free and safe for unit testing.
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

        // Basic normalization; ensures the expected properties exist.
        return data.map(function (item) {
            return {
                id: item.id,
                notice_num: item.notice_num || item.noticet_num || "",
                announcement_date: item.announcement_date || "",
                closing_date: item.closing_date || "",
                command_location: item.command_location || "",
                grade: item.grade || "",
                position: item.position || "",
                details: item.details || ""
            };
        });
    }

    /**
     * Optional helper: format a date string (YYYY-MM-DD or similar) into a
     * more readable format. For now this is intentionally simple.
     *
     * @param {string} dateStr
     * @returns {string}
     */
    function formatDate(dateStr) {
        if (!dateStr) {
            return "";
        }

        // You can enhance this for your actual date formats.
        return dateStr;
    }

    /**
     * Project a Job into an array suitable for DataTables row data.
     * This keeps UI mapping in one place.
     *
     * @param {Job} job
     * @returns {Array} Row data for DataTables
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
        jobToRow: jobToRow
    };

}());

// Export for Node/Jest, but remain global for browser
if (typeof module !== "undefined" && module.exports) {
    module.exports = JobsCore;
}
