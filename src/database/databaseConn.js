const mongoose = require("mongoose");

const mongo_url_local = "mongodb://localhost:27017/nasir_sir_and_classes";
process.env.MONGODB_URL;

mongoose
  .connect(process.env.MONGODB_URL)
  // .connect(mongo_url_local)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Something went wrong, can't connect to database \n");
    console.log(err);
  });
  
