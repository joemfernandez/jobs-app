/* tests/jobs-core.test.js */

var JobsCore = require("../src/core/jobs-core.js");

describe("JobsCore.parseJson", function () {
  it("parses valid JSON array into job objects", function () {
    var raw = JSON.stringify([
      {
        id: 1,
        notice_num: "JOB-001",
        announcement_date: "2025-01-01",
        command_location: "HQ",
        grade: "GS-12",
        position: "Analyst",
        details: "<p>Details</p>"
      }
    ]);

    var result = JobsCore.parseJson(raw);

    expect(result.length).toBe(1);
    expect(result[0].notice_num).toBe("JOB-001");
    expect(result[0].position).toBe("Analyst");
  });

  it("throws if root JSON is not an array", function () {
    var raw = JSON.stringify({ id: 1 });
    expect(function () {
      JobsCore.parseJson(raw);
    }).toThrow();
  });
});

describe("JobsCore.jobToRow", function () {
  it("maps a job to a row array in expected order", function () {
    var job = {
      notice_num: "JOB-001",
      announcement_date: "2025-01-01",
      command_location: "HQ",
      grade: "GS-12",
      position: "Analyst"
    };

    var row = JobsCore.jobToRow(job);

    expect(row[0]).toBe("JOB-001");
    expect(row[1]).toBe("2025-01-01");
    expect(row[2]).toBe("HQ");
    expect(row[3]).toBe("GS-12");
    expect(row[4]).toBe("Analyst");
  });
});
