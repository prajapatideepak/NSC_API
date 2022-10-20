const mongoose = require("mongoose");

// const mongo_url_local = "mongodb://localhost:27017/nasir_sir_and_classes";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Can't connect to database", err);
  });
