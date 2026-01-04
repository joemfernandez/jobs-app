/* src/ui/jobs-ui.js */
/* global JobsCore, module */

var JobsApp = typeof JobsApp !== "undefined" ? JobsApp : {};
JobsApp.UI = (function ($, JobsCore) {
    "use strict";

    if (!$) {
        throw new Error("JobsApp.UI requires jQuery.");
    }
    if (!JobsCore) {
        throw new Error("JobsApp.UI requires JobsCore.");
    }

    /**
     * Initialize the job table with data and attach UI behavior.
     *
     * @param {Object} options
     * @param {string} options.tableSelector - CSS selector for the table element.
     * @param {Array} options.jobs - Array of Job objects.
     * @param {string} [options.detailsContainerSelector] - Optional selector for a shared details container.
     */
    function init(options) {
        options = options || {};
        var tableSelector = options.tableSelector || "#jobs-table";
        var jobs = options.jobs || [];

        var $table = $(tableSelector);
        if ($table.length === 0) {
            throw new Error("JobsApp.UI.init: table element not found for selector: " + tableSelector);
        }

        // Build row data for DataTables
        var rows = jobs.map(function (job) {
            return JobsCore.jobToRow(job);
        });

        // Initialize DataTables
        var dataTable = $table.DataTable({
            data: rows,
            columns: [
                { title: "Notice Number" },
                { title: "Announcement Date" },
                { title: "Command Location" },
                { title: "Grade" },
                { title: "Position" }
            ],
            paging: true,
            searching: true,
            info: true
        });

        // Attach click handler for showing details when Position is clicked
        $table.on("click", "tbody tr", function () {
            var rowIndex = dataTable.row(this).index();
            if (rowIndex == null) {
                return;
            }
            var job = jobs[rowIndex];
            toggleDetails(job, options.detailsContainerSelector);
        });

        return dataTable;
    }

    /**
     * Toggle the details panel for a given job.
     * Can either render into a dedicated container or inline.
     *
     * @param {Object} job
     * @param {string} [detailsContainerSelector]
     */
    function toggleDetails(job, detailsContainerSelector) {
        if (!job) {
            return;
        }

        if (detailsContainerSelector) {
            var $container = $(detailsContainerSelector);
            if ($container.length === 0) {
                return;
            }
            // Simple toggle: if container currently shows this job, clear it; otherwise show it
            var currentId = $container.data("job-id");
            if (currentId === job.id) {
                $container.empty().hide().data("job-id", null);
            } else {
                $container
                    .html(job.details || "<p>No details available.</p>")
                    .data("job-id", job.id)
                    .show();
            }
        } else {
            // Fallback: alert (for debugging). You can replace this with inline row details.
            alert(job.details || "No details available.");
        }
    }

    return {
        init: init,
        toggleDetails: toggleDetails
    };

}(jQuery, JobsCore));

// Optional export for Node/Jest
if (typeof module !== "undefined" && module.exports) {
    module.exports = JobsApp.UI;
}
