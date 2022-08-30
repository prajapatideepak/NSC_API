const student = [
  { id: 1, name: "Sadik" },
  { id: 2, name: "Shad" },
  { id: 3, name: "monu" },
  { id: 4, name: "deepak" },
];

function httpGetAllStudents(req, res) {
  res.status(200).json(student);
}

module.exports = {
  httpGetAllStudents,
};
