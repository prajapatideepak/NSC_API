const Student = require('../../models/student');

const student = [
  { id: 1, name: "Sadik" },
  { id: 2, name: "Shad" },
  { id: 3, name: "monu" },
  { id: 4, name: "deepak" },
];

function getAllStudents(req, res) {
  res.status(200).json(student);
}

async function registerStudent(req, res){
  const {fullName, motherName, whatsappNo, alternateNo, dob, gender, std, stream, medium, admissionDate, totalFees, email, discount, reference, netPayable, note} = req.body;

  console.log(fullName);
  
  // const student = await Student.create({

  // }) 
}

module.exports = {
  getAllStudents,
  registerStudent
};
