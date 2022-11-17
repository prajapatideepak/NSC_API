const students = require("../models/student");
const academics = require("../models/academic");

async function getFeesAndStudentData(id) {
  path = "basic_info_id";
  // const match = { full_name: "karadiya Sadik" };
  const studentData = await students
    .find({ id: { $e: id } })
    .populate({
      path: "academic",
      populate: {
        path: "fees_id",
      },
      populate: {
        path: "class_id",
      },
    })
    .populate([path, "contact_info_id"]);
  const data = studentData.map((m) => {
    return { student: m, academic: m.academic };
  });

  return data;
}

module.exports = {
  getFeesAndStudentData,
};
