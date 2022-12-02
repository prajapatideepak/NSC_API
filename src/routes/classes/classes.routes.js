const express = require("express");
const {createNewClass, getAllClassesByYear, getAllClasses,  displayClass, updateClass, deleteClass, classSearch, transferClasses, displayStudentInClass,exportStudentInClass,exportPendingStudentInClass, studentSearchById_Name_Mobile} = require("./classes.controller");
const classesRouter = express.Router();


classesRouter.post("/create",createNewClass);
classesRouter.get("/",getAllClasses);
classesRouter.get("/classesbyyear",getAllClassesByYear);
classesRouter.get("/active",displayClass);
classesRouter.put("/update/:id",updateClass);
classesRouter.put("/delete/:id",deleteClass);
classesRouter.get("/search",classSearch);
classesRouter.post("/transferclasses",transferClasses);
classesRouter.get("/displaystudentinclass/:id",displayStudentInClass);
classesRouter.get("/exportStudentInClass/:id",exportStudentInClass);
classesRouter.get("/exportPendingStudentInClass/:id",exportPendingStudentInClass);
classesRouter.get("/studentsearchbyid_name_mobile/:id_name_whatsapp",studentSearchById_Name_Mobile);

module.exports = classesRouter;
