const express = require("express");
const adminRouter = require("./routes/admin/admin.routes");
const facultyRouter = require("./routes/faculty/faculty.routes");
const SalaryRouter = require("./routes/Salary/salary.routes");
const feesRouter = require("./routes/fees/fees.routes");
const studentRouter = require("./routes/students/student.routes");
const receiptRouter = require("./routes/receipt/receipt.routes");
const reportRouter = require("./routes/report/report.route");
const classesRouter = require("./routes/classes/classes.routes");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
  );
  
app.use(express.json());
app.use(cors());
app.use(express.static("public/images"));
app.use(express.urlencoded({ extended: false }));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});
app.use("/students", studentRouter);
app.use("/fees", feesRouter);
app.use("/admin", adminRouter);
app.use("/classes", classesRouter);

app.use("/receipt", receiptRouter);
app.use("/report", reportRouter);

app.use("/faculty", facultyRouter);
app.use("/salary", SalaryRouter);

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({success: false, message: err.message});
})

module.exports = app;
