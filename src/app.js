const express = require("express");
const adminRouter = require("./routes/admin/admin.routes");
const facultyRouter = require("./routes/faculty/faculty.routes");
const SalaryRouter = require("./routes/Salary/salary.routes");
const feesRouter = require("./routes/fees/fees.routes");
const studentRouter = require("./routes/students/student.routes");
const receiptRouter = require("./routes/receipt/receipt.routes");
const reportRouter = require("./routes/report/report.route");
const classesRouter = require("./routes/classes/classes.routes")
const cors = require("cors");


const app = express();

app.use(express.json());

app.use(cors());
app.use(express.urlencoded({ extended: false }));
 
app.use("/students", studentRouter);
app.use("/fees", feesRouter);
app.use("/admin", adminRouter);

app.use("/classes",classesRouter);

app.use("/receipt", receiptRouter);
app.use("/report", reportRouter);

app.use("/faculty", facultyRouter);
app.use("/salary", SalaryRouter);

module.exports = app;
