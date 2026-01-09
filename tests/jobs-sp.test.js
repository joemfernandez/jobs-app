/* tests/jobs-sp.test.js */

const DataServiceFactory = require("../src/sp/jobs-sp.js");

describe("JobsApp.DataService (DI + guard)", function () {
  var mock$;
  var mockJobsCore;

  beforeEach(function () {
    mock$ = { ajax: jest.fn() };
    mockJobsCore = { parseJson: jest.fn() };
  });

  //
  // Guard behavior
  //

  it("throws a clear error when getJobs is called before create()", function () {
    expect(function () {
      DataServiceFactory.getJobs("url");
    }).toThrow(
      "JobsApp.DataService has not been initialized. Call JobsApp.DataService.create(jQuery, JobsCore) first."
    );
  });

  //
  // DI instance behavior
  //

  it("throws when url is missing", function () {
    var instance = DataServiceFactory.create(mock$, mockJobsCore);

    expect(function () {
      instance.getJobs();
    }).toThrow("getJobs: url is required.");
  });

  it("calls $.ajax with the expected configuration", function () {
    var instance = DataServiceFactory.create(mock$, mockJobsCore);
    mock$.ajax.mockResolvedValue("[]");

    instance.getJobs("/test/url");

    expect(mock$.ajax).toHaveBeenCalledWith({
      url: "/test/url",
      method: "GET",
      dataType: "text"
    });
  });

  it("resolves with parsed jobs when AJAX succeeds", async function () {
    var raw = '[{"id":1}]';
    var parsed = [{ id: 1 }];

    var instance = DataServiceFactory.create(mock$, mockJobsCore);

    mock$.ajax.mockResolvedValue(raw);
    mockJobsCore.parseJson.mockReturnValue(parsed);

    var result = await instance.getJobs("/jobs");

    expect(mockJobsCore.parseJson).toHaveBeenCalledWith(raw);
    expect(result).toEqual(parsed);
  });

  it("rejects when AJAX rejects", async function () {
    var error = new Error("Network failure");
    var instance = DataServiceFactory.create(mock$, mockJobsCore);

    mock$.ajax.mockRejectedValue(error);

    await expect(instance.getJobs("/jobs")).rejects.toThrow("Network failure");
  });
});
