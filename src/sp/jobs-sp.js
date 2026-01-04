/* src/sp/jobs-sp.js */
/* global JobsCore, JobsApp */

var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};
JobsApp.DataService = (function ($, JobsCore) {
    "use strict";

    if (!$) {
        throw new Error("JobsApp.DataService requires jQuery.");
    }
    if (!JobsCore) {
        throw new Error("JobsApp.DataService requires JobsCore.");
    }

    /**
     * Load jobs from a URL that returns raw JSON text.
     *
     * @param {string} url
     * @returns {jQuery.Promise} Resolves with array of Job objects.
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

}(jQuery, JobsCore));
