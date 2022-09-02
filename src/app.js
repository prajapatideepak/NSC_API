const express = require("express");

const feesRouter = require("./routes/fees/fees.routes");
const studentRouter = require("./routes/students/student.routes");

const app = express();

app.use(express.json());

app.use("/students", studentRouter);
app.use("/fees", feesRouter);
module.exports = app;
