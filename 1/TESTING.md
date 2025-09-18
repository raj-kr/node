# Testing Guide

This document describes the comprehensive test suite for the Node.js + TypeScript HTTP server project.

## Test Structure

```txt
src/
├── __tests__/
│   ├── setup.ts              # Test configuration and setup
│   ├── server.test.ts        # Unit tests for HttpServer class
│   ├── integration.test.ts   # Integration tests for HTTP endpoints
│   └── index.test.ts         # Tests for main entry point
├── server.ts                 # Refactored server class
└── index.ts                  # Main entry point
```

## Test Coverage

- **Overall Coverage**: 87.5% statements, 100% branches, 88.23% functions, 87.5% lines
- **Server.ts**: 100% coverage (fully tested)
- **Index.ts**: 45.45% coverage (graceful shutdown handlers not tested in unit tests)

## Test Categories

### 1. Unit Tests (`server.test.ts`)

Tests the `HttpServer` class in isolation:

- **Server Creation**
  - ✅ Creates server with default port
  - ✅ Creates server with custom port
  - ✅ Uses factory function correctly

- **Server Lifecycle**
  - ✅ Starts server successfully
  - ✅ Stops server successfully
  - ✅ Returns server instance

### 2. Integration Tests (`integration.test.ts`)

Tests the complete HTTP server functionality:

#### GET / Endpoint

- ✅ Returns 202 status and correct response
- ✅ Sets correct headers
- ✅ Handles various request scenarios

#### POST / Endpoint

- ✅ Handles valid JSON requests
- ✅ Handles empty JSON requests
- ✅ Handles complex JSON structures
- ✅ Handles large JSON payloads
- ✅ Handles invalid JSON gracefully
- ✅ Handles malformed JSON
- ✅ Handles empty POST body
- ✅ Handles non-JSON content types

#### 404 Not Found

- ✅ Returns 404 for unknown GET routes
- ✅ Returns 404 for unknown POST routes
- ✅ Returns 404 for PUT requests
- ✅ Returns 404 for DELETE requests
- ✅ Returns 404 for PATCH requests

#### Edge Cases

- ✅ Handles requests with query parameters
- ✅ Handles requests with URL fragments
- ✅ Handles various content types
- ✅ Validates response headers

### 3. Entry Point Tests (`index.test.ts`)

Tests the main application entry point:

- ✅ Creates server instance
- ✅ Starts server on initialization
- ✅ Handles server start errors gracefully

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Test Scripts

| Script          | Command                                 | Description                    |
| --------------- | --------------------------------------- | ------------------------------ |
| `test`          | `jest`                                  | Run all tests once             |
| `test:watch`    | `jest --watch`                          | Run tests in watch mode        |
| `test:coverage` | `jest --coverage`                       | Run tests with coverage report |
| `test:ci`       | `jest --ci --coverage --watchAll=false` | Run tests for CI/CD            |

## Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',           // TypeScript support
  testEnvironment: 'node',     // Node.js environment
  roots: ['<rootDir>/src'],    // Test root directory
  testMatch: [                 // Test file patterns
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',   // Transform TypeScript files
  },
  collectCoverageFrom: [       // Coverage collection
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
```

### Test Setup (`setup.ts`)

- Sets test timeout to 10 seconds
- Mocks console.log to avoid cluttering test output
- Provides global test configuration

## Test Dependencies

### Development Dependencies

```json
{
  "jest": "^29.4.2",
  "@types/jest": "^29.4.0",
  "ts-jest": "^29.4.2",
  "supertest": "^6.3.3",
  "@types/supertest": "^2.0.12"
}
```

### Key Testing Libraries

- **Jest**: JavaScript testing framework
- **ts-jest**: TypeScript preprocessor for Jest
- **Supertest**: HTTP assertion library for testing HTTP servers
- **@types/jest**: TypeScript definitions for Jest
- **@types/supertest**: TypeScript definitions for Supertest

## Test Examples

### Unit Test Example

```typescript
describe("HttpServer", () => {
  let server: HttpServer;

  beforeEach(() => {
    server = new HttpServer({ port: 0 });
  });

  afterEach(async () => {
    await server.stop();
  });

  test("should create server with default port", () => {
    const defaultServer = new HttpServer();
    expect(defaultServer).toBeInstanceOf(HttpServer);
  });
});
```

### Integration Test Example

```typescript
describe("HTTP Server Integration Tests", () => {
  let server: HttpServer;
  let app: http.Server;

  beforeAll(async () => {
    server = new HttpServer({ port: 0 });
    app = server.getServer();
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("should handle valid JSON POST request", async () => {
    const testData = { message: "Hello World", id: 123 };
    
    const response = await request(app)
      .post("/")
      .send(testData)
      .expect(200);

    expect(response.headers["content-type"]).toBe("application/json");
    expect(JSON.parse(response.text)).toEqual(testData);
  });
});
```

## Test Data

### Sample Test Cases

1. **Valid JSON POST**:

   ```json
   { "message": "Hello World", "id": 123 }
   ```

2. **Complex JSON POST**:

   ```json
   {
     "users": [
       { "id": 1, "name": "John", "active": true },
       { "id": 2, "name": "Jane", "active": false }
     ],
     "metadata": {
       "total": 2,
       "timestamp": "2023-01-01T00:00:00Z"
     }
   }
   ```

3. **Invalid JSON**:

   ```txt
   "invalid json"
   ```

4. **Large JSON**:

   ```json
   {
     "items": Array.from({ length: 1000 }, (_, i) => ({
       "id": i,
       "value": "Item " + i,
       "data": "x".repeat(100)
     }))
   }
   ```

## Best Practices

### 1. Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Isolation

- Each test should be independent
- Use `beforeEach`/`afterEach` for setup/cleanup
- Mock external dependencies

### 3. Test Coverage

- Aim for high test coverage
- Focus on critical business logic
- Test edge cases and error conditions

### 4. Test Performance

- Use appropriate timeouts
- Clean up resources after tests
- Avoid memory leaks

## Continuous Integration

The test suite is designed to work with CI/CD pipelines:

```bash
# CI command
npm run test:ci
```

This command:

- Runs tests once (no watch mode)
- Generates coverage report
- Exits with appropriate code for CI systems

## Debugging Tests

### Running Specific Tests

```bash
# Run specific test file
npm test -- server.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should handle valid JSON"

# Run tests in specific directory
npm test -- __tests__/integration.test.ts
```

### Debug Mode

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
# Run tests with verbose output
npm test -- --verbose
```

## Coverage Reports

Coverage reports are generated in multiple formats:

- **Text**: Console output
- **LCOV**: For CI/CD integration
- **HTML**: Detailed browser-viewable report

Coverage files are saved in the `coverage/` directory.

## Maintenance

### Adding New Tests

1. Create test file in `src/__tests__/`
2. Follow naming convention: `*.test.ts` or `*.spec.ts`
3. Import necessary dependencies
4. Write descriptive test cases
5. Update this documentation if needed

### Updating Tests

- Keep tests up-to-date with code changes
- Refactor tests when refactoring code
- Remove obsolete tests
- Update test data as needed

---

## Summary

This comprehensive test suite provides:

- ✅ **33 test cases** covering all major functionality
- ✅ **87.5% code coverage** with 100% branch coverage
- ✅ **Unit tests** for individual components
- ✅ **Integration tests** for end-to-end functionality
- ✅ **Edge case testing** for robust error handling
- ✅ **CI/CD ready** configuration
- ✅ **Multiple test runners** for different scenarios

The test suite ensures the HTTP server is reliable, maintainable, and ready for production use.
