const student = [
  { id: 1, name: "Sadik" },
  { id: 2, name: "Shad" },
  { id: 3, name: "monu" },
  { id: 4, name: "deepak" },
];

function getAllStudents(req, res) {
  res.status(200).json(student);
}

function registerStudent(req, res){
  
}

module.exports = {
  getAllStudents,
  registerStudent
};
