// Test setup file
// This file runs before each test file

// Set test timeout to 10 seconds
jest.setTimeout(10000);

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

// Dummy test to satisfy Jest requirement
describe("Test Setup", () => {
  test("should load setup file", () => {
    expect(true).toBe(true);
  });
});
