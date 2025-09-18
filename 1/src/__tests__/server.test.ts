import { HttpServer, createServer, PORT } from "../server";
import http from "http";

describe("HttpServer", () => {
  let server: HttpServer;

  beforeEach(() => {
    server = new HttpServer({ port: 0 }); // Use port 0 for random available port
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("Server Creation", () => {
    test("should create server with default port", () => {
      const defaultServer = new HttpServer();
      expect(defaultServer).toBeInstanceOf(HttpServer);
      expect(defaultServer.getServer()).toBeInstanceOf(http.Server);
    });

    test("should create server with custom port", () => {
      const customServer = new HttpServer({ port: 4000 });
      expect(customServer).toBeInstanceOf(HttpServer);
    });

    test("should create server using factory function", () => {
      const factoryServer = createServer({ port: 5000 });
      expect(factoryServer).toBeInstanceOf(HttpServer);
    });
  });

  describe("Server Lifecycle", () => {
    test("should start server successfully", async () => {
      await expect(server.start()).resolves.toBeUndefined();
    });

    test("should stop server successfully", async () => {
      await server.start();
      await expect(server.stop()).resolves.toBeUndefined();
    });

    test("should return server instance", () => {
      const serverInstance = server.getServer();
      expect(serverInstance).toBeInstanceOf(http.Server);
    });
  });
});
