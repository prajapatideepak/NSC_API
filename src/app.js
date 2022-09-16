const express = require("express");
const adminRouter = require("./routes/admin/admin.routes");

const feesRouter = require("./routes/fees/fees.routes");
const studentRouter = require("./routes/students/student.routes");
const receiptRouter = require("./routes/receipt/receipt.routes");

const app = express();

app.use(express.json());

app.use("/students", studentRouter);
app.use("/fees", feesRouter);
app.use("/admin", adminRouter);

<<<<<<< HEAD
app.use("/admin", adminRouter);
=======
app.use("/receipt", receiptRouter);

>>>>>>> origin/master
module.exports = app;
