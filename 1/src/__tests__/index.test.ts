// Mock the server module to test the main entry point
const mockServer = {
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
};

jest.mock("../server", () => ({
  createServer: jest.fn(() => mockServer),
}));

describe("Index Entry Point", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create server instance", () => {
    // Re-import to trigger the module execution
    jest.resetModules();
    const { createServer } = require("../server");

    require("../index");

    expect(createServer).toHaveBeenCalledTimes(1);
  });

  test("should start server", () => {
    jest.resetModules();
    require("../index");

    expect(mockServer.start).toHaveBeenCalledTimes(1);
  });

  test("should handle server start errors", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockServer.start.mockRejectedValue(new Error("Start failed"));

    jest.resetModules();
    require("../index");

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
