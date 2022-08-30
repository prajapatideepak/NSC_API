const PORT = process.env.port || 5000;

const http = require("http");

const app = require("./app.js");

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server is Listeninng ....");
});
