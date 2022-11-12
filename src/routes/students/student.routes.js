const express = require("express");
const {getAllStudents , registerStudent, getStudentDetails, getStudentDetailsUniversal, updateStudentDetails, cancelStudentAdmission, transerStudentsToNewClass } = require("./student.controller");

const studentRouter = express.Router();

studentRouter.post("/", getAllStudents);

studentRouter.post("/register", registerStudent);

studentRouter.get("/details/:id_name_whatsapp", getStudentDetails);

studentRouter.get("/details/universal/:id_name_whatsapp", getStudentDetailsUniversal);

studentRouter.post("/update", updateStudentDetails);

studentRouter.get("/cancel-admission/:student_id", cancelStudentAdmission);

studentRouter.post("/transfer", transerStudentsToNewClass);

module.exports = studentRouter;
