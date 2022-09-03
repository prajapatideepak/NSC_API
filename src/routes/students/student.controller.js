const Student = require('../../models/student');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const Fee = require('../../models/fees');
const Academic = require('../../models/academic');
const Admin = require('../../models/admin');
const Classes = require('../../models/classes');
const Medium = require('../../models/medium');

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
  try{
    const {photo, full_name, mother_name, whatsapp_no, alternate_no, dob, gender, address, standard, stream, medium, total_fees, email, discount, reference, net_fees, note, school_name} = req.body;

    const basic_info_id = await BasicInfo.create({
      photo,
      full_name,
      gender,
      dob
    })

    const contact_info_id = await ContactInfo.create({
      whatsapp_no,
      alternate_no,
      email,
      address
    })

    const studentId =Math.floor(((Math.random() * 10000) + 1) + Math.random() * 1000);
    
    const student = await Student.create({
      student_id: studentId,
      mother_name,
      reference,
      note,
      basic_info_id: basic_info_id._id,
      contact_info_id: contact_info_id._id
    });

    const fees = await Fee.create({
      total_fees,
      discount,
      net_fees
    });

    const medium_info = await Medium.findOne({medium_name:medium});
    
    const class_info = await Classes.findOne({standard, medium_id:medium_info._id, stream});

    
    const academic = await Academic.create({
      class_id: class_info._id,
      student_id: student._id,
      fees_id: fees._id,
      school_name
    })

    // const fees_receipt_info = await FeesReceipt.create({
    //   fees_id: fees._id,
    //   admin_id: 238508408
    // })

    //201 = created
    res.status(201).json('Student Registration Successfull');
  } catch(error){
    //500 = internal server error
    res.status(500).json(error+" "+error.message);
  }
}

module.exports = {
  getAllStudents,
  registerStudent
};
