require("dotenv").config();

const PORT = process.env.PORT || 5000;

const http = require("http");
const app = require("./app.js");

const server = http.createServer(app);

async function startServer() {
  server.listen(PORT, () => {
    console.log("Server is Listeninng ....");
  });
}

startServer();
