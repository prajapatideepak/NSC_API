const staffs = require('../../models/staff');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const transactions = require('../../models/transaction');
const salary_receipt = require('../../models/salaryReceipt');
const hourly_salary = require("../../models/hourlySalary");
const monthly_salary = require("../../models/monthlySalary")
const admin = require("../../models/admin")

async function registerFaculty(req, res) {
  try {
    const { photo, full_name, whatsapp_no, alternate_no, dob, gender, address, email, joining_date} = req.body;

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
      address,
      joining_date
    })

    const Staff = await staffs.create({
      basic_info_id: basic_info_id._id,
      contact_info_id: contact_info_id._id,
      joining_date
    });


    res.status(201).json('Student Registration Successfull');

  } catch (error) {
    //500 = internal server error
    res.status(500).json(error + " " + error.message);
  }
}

function getAllFaculty(req, res) {
  staffs.find()
    .then(result => {
      res.status(200).json({
        staffData: result

      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
}


async function getFaculty(req, res) {
  try {
   
    let staff_details;
     staff_details = await staffs.findOne({ _id: req.params.id }).populate("basic_info_id").populate("contact_info_id")
     console.log(staff_details)
    
   
    res.status(200).json({
        success: true,
        data: {
          staff_details
        }
    });
        

  } catch (error) {
    return res.status(500).send(error.stack);
  }
}

async function editFaculty(req, res) {
  try{
    const staff_details = await staffs.findOneAndUpdate({
      _id: req.params.id,
      joining_date: req.body.joining_date
    })

    await BasicInfo.findOneAndUpdate({_id:staff_details.basic_info_id},{
      photo: req.body.photo,
      full_name: req.body.full_name,
      gender: req.body.gender,
      dob: req.body.dob,
    })

    await ContactInfo.findOneAndUpdate({_id:staff_details.contact_info_id},{
      whatsapp_no: req.body.whatsapp_no,
      alternate_no: req.body.alternate_no,
      address: req.body.address,
      email: req.body.mail,
    })

    res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
    })

  }
  catch(error){
    res.status(400).json({
      success: false,
      message: error.message
    })
  }

}

function deleteFaculty(req, res) {
  staffs.findOneAndUpdate({ 
    _id: req.params.id,
    is_cancelled : req.body.is_cancelled
   })


    .then(result => {

      res.status(200).json({
        message: "Faculty Deleted",
        result: result
      })
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })

}









   






















module.exports = {
  getAllFaculty,
  registerFaculty,
  getFaculty,
  editFaculty,
  deleteFaculty,
  // salaryFaculty,
  // facultyreceipt,
  // hourlySalary,
  // monthlySalary
};







