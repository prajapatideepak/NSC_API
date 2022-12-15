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
const Exceljs = require("Exceljs");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT 
});

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
          var fileName = Date.now() + "_" + files.photo.originalFilename;

          fs.readFile( oldPath, function (err, data) {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: err.message });
            }
            imagekit.upload({
              file : data,
              fileName : fileName, 
              overwriteFile: true,
              folder: '/staff_profiles'
            }, function(error, result) {
              if(error) {
                return res
                  .status(500)
                  .json({ success: false, message: error.message });
              }
              photo = result.url
            });
          });
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
            alternate_no : alternate_no != '' ? alternate_no : '',
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
            data: Staff, basic_info_id,contact_info_id,
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
      res.status(500).json({
        error: err
      })
    })
}


// --------------------------------------------------------
// --------------  Export ALL FACULTY ------------------------
// --------------------------------------------------------
async function Exportallfaculty(req, res) {
  try {
    const allfaculty = await staffs.find().populate("basic_info_id").populate("contact_info_id")

    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Staff");
    worksheet.columns = [
      { header: "Name", key: "Name", width: "10" },
      { header: "Gender", key: "Gender", width: "10" },
      { header: "Phone", key: "Phone", width: "10" },
      { header: "Role", key: "Role", width: "10" },
    ];

    let count = 1;
    allfaculty.forEach(faculty => {
      (faculty)._id = count;
      worksheet.addRow({
        "Name": faculty.basic_info_id.full_name,
        "Gender": faculty.basic_info_id.gender,
        "Phone": faculty.contact_info_id.whatsapp_no,
        "Role": faculty.role
      })
      count += 1;
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })
    const homeDir = require('os').homedir(); // See: https://www.npmjs.com/package/os
    const desktopDir = `${homeDir}/Downloads`;

    const data = await workbook.xlsx.writeFile(`${desktopDir}/All_Staff.xlsx`)
    return res.status(200).json({
      success: true,
      message: "Data Export",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
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
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      let photo = fields.old_photo_url == fields.photo_name ? fields.old_photo_url : '';

      const myPromise = new Promise(async(resolve, reject) => {
        //Searching and deleting old photo from imagekit
        if(
          fields.old_photo_url != fields.photo_name
        ) {
          //Searching old photo
          const old_photo_name = fields.old_photo_url.split('/')[5];
          let old_photo_fileId = '';

          imagekit.listFiles({
            searchQuery : `'name'="${old_photo_name}"`
          }, function(error, result) {
            if(error){
              return res.status(400).json({
                success: false,
                message: error.message,
              });
            } 
            if(result && result.length > 0) {
              old_photo_fileId = result[0].fileId

              //Deleting old photo
              imagekit.deleteFile(old_photo_fileId, function(error, result) {
                if(error){
                  return res.status(400).json({
                    success: false,
                    message: error.message,
                  });
                }
              });
            }
          });
        }

        if (
          fields.old_photo_url != fields.photo_name && fields.photo_name != ""
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
          fs.readFile( oldPath, function (err, data) {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: err.message });
            }
            imagekit.upload({
              file : data,
              fileName : fileName, 
              overwriteFile: true,
              folder: '/staff_profiles'
            }, function(error, result) {
              if(error) {
                return res
                  .status(500)
                  .json({ success: false, message: error.message });
              }
              photo = result.url
              resolve();
            });
          });
        }
        else{
          resolve()
        }
      })

      myPromise.then(async () => {
        const {
          full_name,
          email,
          whatsapp_no,
          alternate_no,
          dob,
          gender,
          role,
          address,
          joining_date,
        } = fields;

        const faculty_id = req.params.id
        const staff_details = await staffs.findByIdAndUpdate(
          faculty_id,
          {
            joining_date,
            role
          })

        const basic_info_id = await BasicInfo.findByIdAndUpdate(staff_details.basic_info_id, {
          photo,
          full_name,
          gender,
          dob
        })

        const contact_info_id = await ContactInfo.findByIdAndUpdate(staff_details.contact_info_id, {
          whatsapp_no,
          alternate_no,
          address,
          email
        })

        res.status(200).json({
          success: true,
          message: "Profile Updated successfully",

        })
      })
    })
  }
  catch (error) {
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
      res.status(500).json({
        error: err
      })
    })

}



module.exports = {
  getAllFaculty,
  Exportallfaculty,
  registerFaculty,
  getFacultydetails,
  editFaculty,
  deleteFaculty,
};
















































