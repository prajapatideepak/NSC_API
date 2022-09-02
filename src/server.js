require('dotenv').config();

const PORT = process.env.PORT || 5000;

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app.js");

const server = http.createServer(app);

mongoose.connection.on("open", () => {
  console.log("MongoDB Connection Ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  });

  server.listen(PORT, () => {
    console.log("Server is Listeninng ....");
  });
}

startServer();
