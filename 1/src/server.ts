import http from "http";
import { IncomingMessage, ServerResponse } from "http";

export const PORT = 3003;

export interface ServerConfig {
  port: number;
}

export class HttpServer {
  private server: http.Server;
  private config: ServerConfig;

  constructor(config: ServerConfig = { port: PORT }) {
    this.config = config;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    res.statusCode = 202;
    res.setHeader("Content-Type", "text/plain");

    if (req.method === "GET" && req.url === "/") {
      this.handleGetRequest(req, res);
    } else if (req.method === "POST" && req.url === "/") {
      this.handlePostRequest(req, res);
    } else {
      this.handleNotFound(req, res);
    }
  }

  private handleGetRequest(req: IncomingMessage, res: ServerResponse): void {
    res.end("Got your response");
  }

  private handlePostRequest(req: IncomingMessage, res: ServerResponse): void {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        console.log(parsed);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsed));
      } catch (e) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });
  }

  private handleNotFound(req: IncomingMessage, res: ServerResponse): void {
    res.statusCode = 404;
    res.end("Not Found");
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.config.port, () => {
        console.log("Server is live");
        resolve();
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server.close(() => {
        console.log("Server stopped");
        resolve();
      });
    });
  }

  public getServer(): http.Server {
    return this.server;
  }
}

// Factory function for easier testing
export function createServer(config?: ServerConfig): HttpServer {
  return new HttpServer(config);
}
