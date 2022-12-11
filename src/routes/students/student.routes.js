const express = require("express");
const {registerStudent, getAllStudents, getStudentDetails, getStudentDetailsUniversal, updateStudentDetails, cancelStudentAdmission, transferStudentsToNewClass, deleteAndTransferStudentToNewClass } = require("./student.controller");

const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);

studentRouter.post("/", getAllStudents);

studentRouter.get("/details/:id_name_whatsapp", getStudentDetails);

studentRouter.get("/details/universal/:id_name_whatsapp", getStudentDetailsUniversal);

studentRouter.put("/update/:student_id", updateStudentDetails);

studentRouter.get("/cancel-admission/:student_id", cancelStudentAdmission);

studentRouter.post("/transfer", transferStudentsToNewClass);

studentRouter.post("/delete-and-transfer", deleteAndTransferStudentToNewClass);

module.exports = studentRouter;
