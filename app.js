const express = require("express");

const feesRouter = require("./src/routes/fees/fees.routes");
const studentRouter = require("./src/routes/students/student.routes");

const app = express();

app.use(express.json());

app.use("/students", studentRouter);
app.use("/fees", feesRouter);
module.exports = app;
