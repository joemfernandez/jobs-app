/* tests/jobs-core.test.js */

var JobsCore = require("../src/core/jobs-core.js");

describe("JobsCore.parseJson", function () {
  it("parses a valid JSON array into job objects", function () {
    // Arrange
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

    // Act
    var result = JobsCore.parseJson(raw);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].notice_num).toBe("JOB-001");
    expect(result[0].position).toBe("Analyst");
  });

  it("throws when rawJsonText is not a string", function () {
    // Arrange
    var notAString = { foo: "bar" };

    // Act + Assert
    expect(function () {
      JobsCore.parseJson(notAString);
    }).toThrow();
  });

  it("throws when JSON is malformed", function () {
    // Arrange
    var malformed = "{ this is not valid JSON";

    // Act + Assert
    expect(function () {
      JobsCore.parseJson(malformed);
    }).toThrow();
  });

  it("throws when the root JSON value is not an array", function () {
    // Arrange
    var raw = JSON.stringify({ id: 1 });

    // Act + Assert
    expect(function () {
      JobsCore.parseJson(raw);
    }).toThrow();
  });

  it("defaults missing fields to empty strings", function () {
    // Arrange
    var raw = JSON.stringify([{ id: 1 }]);

    // Act
    var result = JobsCore.parseJson(raw);
    var job = result[0];

    // Assert
    Object.keys(job)
      .filter(function (key) {
        return key !== "id";
      })
      .forEach(function (key) {
        expect(job[key]).toBe("");
      });
  });

  it("returns an empty array when JSON is an empty array", function () {
    // Arrange
    var raw = JSON.stringify([]);

    // Act
    var result = JobsCore.parseJson(raw);

    // Assert
    expect(result).toEqual([]);
  });
});

describe("JobsCore.formatDate", function () {
  it("returns an empty string when dateStr is falsy", function () {
    // Arrange + Act + Assert
    expect(JobsCore.formatDate("")).toBe("");
    expect(JobsCore.formatDate(null)).toBe("");
    expect(JobsCore.formatDate(undefined)).toBe("");
  });

  it("returns the original date string when provided", function () {
    // Arrange
    var date = "2025-01-01";

    // Act
    var result = JobsCore.formatDate(date);

    // Assert
    expect(result).toBe("2025-01-01");
  });
});

describe("JobsCore.jobToRow", function () {
  it("maps a job to a row array in the expected order", function () {
    // Arrange
    var job = {
      notice_num: "JOB-001",
      announcement_date: "2025-01-01",
      command_location: "HQ",
      grade: "GS-12",
      position: "Analyst"
    };

    // Act
    var row = JobsCore.jobToRow(job);

    // Assert
    expect(row.length).toBe(5);
    expect(row[0]).toBe("JOB-001");
    expect(row[1]).toBe("2025-01-01");
    expect(row[2]).toBe("HQ");
    expect(row[3]).toBe("GS-12");
    expect(row[4]).toBe("Analyst");
  });

  it("maps missing fields to undefined or empty strings as appropriate", function () {
    // Arrange
    var job = {};

    // Act
    var row = JobsCore.jobToRow(job);

    // Assert
    expect(row.length).toBe(5);

    expect(row[0]).toBe(undefined); // notice_num
    expect(row[1]).toBe(""); // announcement_date → formatDate("") returns ""
    expect(row[2]).toBe(undefined); // command_location
    expect(row[3]).toBe(undefined); // grade
    expect(row[4]).toBe(undefined); // position
  });
});
