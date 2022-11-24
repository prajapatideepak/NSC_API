const staffs = require('../../models/staff');
const BasicInfo = require('../../models/basicinfo');
const ContactInfo = require('../../models/contactinfo');
const transactions = require('../../models/transaction');
const salary_receipt = require('../../models/salaryReceipt');
const hourly_salary = require("../../models/hourlySalary");
const monthly_salary = require("../../models/monthlySalary")
const admin = require("../../models/admin")
const formidable = require('formidable');
const fs = require('fs');

const { default: mongoose } = require('mongoose');

// --------------------------------------------------------
// -------------- REGISTER FACULTY ------------------------
// --------------------------------------------------------
async function registerFaculty(req, res) {
  try {

    // ------------------------------------------------------------------------------------
    // --------------------------IMAGE UPLOAD ---------------------------------------------
    // ------------------------------------------------------------------------------------
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      let photo = '';

      const myPromise = new Promise((resolve, reject) => {
        if (files.photo.originalFilename != '' && files.photo.size != 0) {
          const ext = files.photo.mimetype.split('/')[1].trim();
          if (files.photo.size >= 2000000) { // 2000000(bytes) = 2MB
            return res.status(400).json({ success: false, message: 'Photo size should be less than 2MB' })
          }
          if (ext != "png" && ext != "jpg" && ext != "jpeg") {
            return res.status(400).json({ success: false, message: 'Only JPG, JPEG or PNG photo is allowed' })
          }
          var oldPath = files.photo.filepath;
          var fileName = Date.now() + '_' + files.photo.originalFilename;
          var newPath = 'public/images' + '/' + fileName;
          var rawData = fs.readFileSync(oldPath)
          fs.writeFile(newPath, rawData, function (err) {
            if (err) {
              return res.status(500).json({ success: false, message: err.message })
            }
            photo = fileName.trim();
            resolve();
          })
        }
        else {
          resolve();
        }
      });

      myPromise
        .then(async () => {
          const { full_name, whatsapp_no, alternate_no, dob, gender, address, email, joining_date, role } = fields;

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
            joining_date,
            role
          });

          res.status(201).json({
            success: true,
            data: Staff, basic_info_id,
            message: "Successfully regiser"
          });
        })

    })


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// --------------------------------------------------------
// --------------  GAT ALL FACULTY ------------------------
// --------------------------------------------------------
async function getAllFaculty(req, res) {
  staffs.find().populate("basic_info_id").populate("contact_info_id")
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
  // try {
  //   let staffData;
  //   staffData = await staffs.find().populate("basic_info_id").populate("contact_info_id")
  //   res.status(200).json({

  //     success: true,
  //     staffData: result
  //   });
  // } catch (error) {
  //   return res.status(500).send(error.stack);
  // }
}


// ------------------------------------------------------------------
// -------------- PARTICULAR FACULTY DETAILS ------------------------
// ------------------------------------------------------------------
async function getFacultydetails(req, res) {

  try {

    let one_staff_Details;
    one_staff_Details = await staffs.findById({ _id: req.params.id })
      .populate("basic_info_id").populate("contact_info_id")
    res.status(200).json({
      success: true,

      one_staff_Details


    });
  } catch (error) {
    return res.status(500).send(error.stack);
  }
}

// --------------------------------------------------------
// --------------   EDIT FACULTY   ------------------------
// --------------------------------------------------------
async function editFaculty(req, res) {
  console.log(1)
  try {
    console.log(0)
    const form = new formidable.IncomingForm();
    console.log(1.0)

    form.parse(req, async function (err, fields, files) {
      console.log(1.1)
      if (err) {
        console.log(err ,"err")
        return res.status(500).json({ success: false, message: err.message });
      }
      let photo = '';
      if (
        files.photo.originalFilename != "" &&
        files.photo.size != 0 &&
        fields.photo_name == ""
      ) {
        const ext = files.photo.mimetype.split("/")[1].trim();

        if (files.photo.size >= 2000000) {
          // 2000000(bytes) = 2MB
          return res.status(400).json({
            success: false,
            message: "Photo size should be less than 2MB",
          });
        }

        if (ext != "png" && ext != "jpg" && ext != "jpeg") {
          return res.status(400).json({
            success: false,
            message: "Only JPG, JPEG or PNG photo is allowed",
          });
        }
        var oldPath = files.photo.filepath;
        var fileName = Date.now() + "_" + files.photo.originalFilename;
        var newPath = "public/images" + "/" + fileName;
        var rawData = fs.readFileSync(oldPath);
        console.log(6)

        fs.writeFile(newPath, rawData, function (err) {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }
          photo = fileName.trim();
        });

      }

      const {
        full_name,
        email,
        whatsapp_no,
        dob,
        gender,
        role,
        address,
        joining_date,
      } = fields;

      const faculty_id = req.params.id
      const staff_details = await staffs.findByIdAndUpdate(
         faculty_id ,
        {
          joining_date,
          role
        })
      console.log(8)
      if (
        (fields.photo_name == "" && photo != "") ||
        (fields.photo_name == "user_default@123.png" && photo == "")
      ) {
        const basic_info_id = await BasicInfo.findByIdAndUpdate(staff_details.basic_info_id, {
          photo,
          full_name,
          gender,
          dob
        })
      } else {
        const basic_info_id = await BasicInfo.findByIdAndUpdate(staff_details.basic_info_id, {
          full_name,
          gender,
          dob
        })

      }
      console.log(9)
      const contact_info_id = await ContactInfo.findByIdAndUpdate(staff_details.contact_info_id, {
        whatsapp_no,
        address,
        email
      })
      console.log(10)
      res.status(200).json({
        success: true,
        message: "Profile Updated successfully",

      })


    })
  }
  catch (error) {
    console.log(error, "errro")
    res.status(400).json({
      success: false,
      message: error.message,


    })
  }

}


// --------------------------------------------------------
// -------------- DELETE FACULTY   ------------------------
// --------------------------------------------------------
function deleteFaculty(req, res) {
  staffs.findOneAndUpdate({
    _id: req.params.id,
    is_cancelled: req.body.is_cancelled
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
  getFacultydetails,
  editFaculty,
  deleteFaculty,
};
















































