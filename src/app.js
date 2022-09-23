const express = require("express");

const feesRouter = require("./routes/fees/fees.routes");
const studentRouter = require("./routes/students/student.routes");
const receiptRouter = require("./routes/receipt/receipt.routes");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use("/students", studentRouter);
app.use("/fees", feesRouter);
app.use("/receipt", receiptRouter);

module.exports = app;
