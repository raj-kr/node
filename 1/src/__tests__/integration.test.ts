import request from "supertest";
import http from "http";
import { HttpServer } from "../server";

describe("HTTP Server Integration Tests", () => {
  let server: HttpServer;
  let app: http.Server;

  beforeAll(async () => {
    server = new HttpServer({ port: 0 }); // Use port 0 for random available port
    app = server.getServer();
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("GET /", () => {
    test("should return 202 status and correct response", async () => {
      const response = await request(app).get("/").expect(202);

      expect(response.text).toBe("Got your response");
      expect(response.headers["content-type"]).toBe("text/plain");
    });

    test("should handle GET request with correct headers", async () => {
      const response = await request(app).get("/").expect(202);

      expect(response.headers["content-type"]).toBe("text/plain");
    });
  });

  describe("POST /", () => {
    test("should handle valid JSON POST request", async () => {
      const testData = { message: "Hello World", id: 123 };

      const response = await request(app).post("/").send(testData).expect(200);

      expect(response.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(response.text)).toEqual(testData);
    });

    test("should handle empty JSON POST request", async () => {
      const response = await request(app).post("/").send({}).expect(200);

      expect(response.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(response.text)).toEqual({});
    });

    test("should handle complex JSON POST request", async () => {
      const complexData = {
        users: [
          { id: 1, name: "John", active: true },
          { id: 2, name: "Jane", active: false },
        ],
        metadata: {
          total: 2,
          timestamp: "2023-01-01T00:00:00Z",
        },
      };

      const response = await request(app)
        .post("/")
        .send(complexData)
        .expect(200);

      expect(response.headers["content-type"]).toBe("application/json");
      expect(JSON.parse(response.text)).toEqual(complexData);
    });

    test("should handle invalid JSON POST request", async () => {
      const response = await request(app)
        .post("/")
        .send("invalid json")
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain");
      expect(response.text).toBe("Invalid JSON");
    });

    test("should handle malformed JSON POST request", async () => {
      const response = await request(app)
        .post("/")
        .send('{"invalid": json}')
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain");
      expect(response.text).toBe("Invalid JSON");
    });

    test("should handle large JSON POST request", async () => {
      const largeData = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          value: `Item ${i}`,
          data: "x".repeat(100),
        })),
      };

      const response = await request(app).post("/").send(largeData).expect(200);

      expect(response.headers["content-type"]).toBe("application/json");
      const parsed = JSON.parse(response.text);
      expect(parsed.items).toHaveLength(1000);
    });
  });

  describe("404 Not Found", () => {
    test("should return 404 for unknown GET routes", async () => {
      const response = await request(app).get("/unknown").expect(404);

      expect(response.text).toBe("Not Found");
    });

    test("should return 404 for unknown POST routes", async () => {
      const response = await request(app)
        .post("/unknown")
        .send({ test: "data" })
        .expect(404);

      expect(response.text).toBe("Not Found");
    });

    test("should return 404 for PUT requests", async () => {
      const response = await request(app)
        .put("/")
        .send({ test: "data" })
        .expect(404);

      expect(response.text).toBe("Not Found");
    });

    test("should return 404 for DELETE requests", async () => {
      const response = await request(app).delete("/").expect(404);

      expect(response.text).toBe("Not Found");
    });

    test("should return 404 for PATCH requests", async () => {
      const response = await request(app)
        .patch("/")
        .send({ test: "data" })
        .expect(404);

      expect(response.text).toBe("Not Found");
    });
  });

  describe("Edge Cases", () => {
    test("should handle requests with query parameters", async () => {
      const response = await request(app)
        .get("/?param=value&test=123")
        .expect(404); // Should still return 404 since we only handle exact "/"

      expect(response.text).toBe("Not Found");
    });

    test("should handle requests with fragments", async () => {
      const response = await request(app).get("/#section").expect(202); // Actually returns 202 because URL is still "/"

      expect(response.text).toBe("Got your response");
    });

    test("should handle empty POST body", async () => {
      const response = await request(app).post("/").expect(200);

      expect(response.headers["content-type"]).toBe("text/plain");
      expect(response.text).toBe("Invalid JSON");
    });

    test("should handle POST with non-JSON content type", async () => {
      const response = await request(app)
        .post("/")
        .set("Content-Type", "text/plain")
        .send("plain text")
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain");
      expect(response.text).toBe("Invalid JSON");
    });
  });

  describe("Response Headers", () => {
    test("should set correct default headers", async () => {
      const response = await request(app).get("/").expect(202);

      expect(response.headers["content-type"]).toBe("text/plain");
    });

    test("should set correct headers for JSON responses", async () => {
      const response = await request(app)
        .post("/")
        .send({ test: "data" })
        .expect(200);

      expect(response.headers["content-type"]).toBe("application/json");
    });

    test("should set correct headers for error responses", async () => {
      const response = await request(app)
        .post("/")
        .send("invalid json")
        .expect(200);

      expect(response.headers["content-type"]).toBe("text/plain");
    });
  });
});
