const FeesSender = require("./feesConfrim");
const PendingSender = require("./pendingFees");
const EmailSender = require("./studentMail");

async function httpRegisterMail(req, res) {
  const data = req.body;
  if (!data.email || !data.full_name) {
    return res.status(400).json({ error: "please Provide All details" });
  }
  try {
    //   const { fullName, email, phone, message } = req.body;
    const { email, full_name } = req.body;
    EmailSender({ email, full_name });
    res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

// for fees Payment
async function httpFeesConfirmMail(req, res) {
  const data = req.body;
  if (
    !data.email ||
    !data.full_name ||
    !data.amount ||
    !data.admin ||
    !data.date
  ) {
    return res.status(400).json({ error: "please Provide All details" });
  }
  try {
    //   const { fullName, email, phone, message } = req.body;
    const { email, full_name, amount, admin, date } = req.body;
    const data = await FeesSender({ email, full_name, amount, date, admin });
    return res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

async function httpPendingFees(req, res) {
  const data = req.body;
  const students = data.students;
  try {
    students.map((student) => {
      email = student.email;
      full_name = student.full_name;
      PendingSender({ email, full_name });
    });

    return res.status(200).json({ msg: "Your message sent successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = {
  httpRegisterMail,
  httpFeesConfirmMail,
  httpPendingFees,
};
