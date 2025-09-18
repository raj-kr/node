"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const PORT = 3003;
const server = http_1.default.createServer((req, res) => {
    res.statusCode = 202;
    res.setHeader("Content-Type", "text/plain");
    if (req.method == "GET" && req.url == "/") {
        res.end("Got your response");
    }
    else if (req.method === "POST" && req.url == "/") {
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
            }
            catch (e) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Invalid JSON");
            }
        });
    }
    else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});
server.listen(PORT, () => {
    console.log("Server is live");
});
//# sourceMappingURL=index.js.map