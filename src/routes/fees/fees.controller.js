<<<<<<< HEAD
const { getFeesAndStudentData } = require("../../model/fees.model");

async function httpGetFeesData(req, res) {
  const search = req.params.search;

  if (!search) {
    return res.status(400).json({
      ok: false,
      error: "Invalid Parameter",
    });
  }
    try {
      const data = await getFeesAndStudentData(search);
      res.status(200).json({
        ok: true,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: `error : ${error}`,
      });
    }
  }

=======
const Student = require('../../models/student');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const Fees = require('../../models/fees');
const Academic = require('../../models/academic');
const Classes = require('../../models/classes');
const FeesReceipt = require('../../models/feesReceipt');

//---------------------------------------------------------
//--------------- PENDING STUDENTS FEES --------------------
//---------------------------------------------------------

async function getAllPendingStudentsFees(req, res) {
  try{

    let pending_students = await Academic.find()
    .populate({
      path: 'student_id',
      select: '-_id student_id',
      populate:[
        {path: 'basic_info_id', select: 'full_name -_id'},
        {path: 'contact_info_id', select: 'whatsapp_no address -_id'}
      ]
    })
    .populate({
      path: 'class_id', 
      select: '-_id class_name medium stream batch_start_year batch_end_year is_active',
      match:{
        is_active : 1
      }
    })
    .populate({
      path: 'fees_id', 
      select: '-_id -date -__v',
      match:{
        pending_amount: { $gt: 0}
      }
    });

    pending_students = pending_students.filter((student)=>{
      return student.fees_id != null && student.class_id != null;
    })

    if(!pending_students[0]){
      return res.status(200).json({
        success: true,
        message: 'No students with pending fees',
      })
    }

    res.status(200).json({
      success: true,
      data:{
        pending_students
      } ,
    });
    
  } catch(error){
    res.status(404).json({
      success: false,
      message: error.message,
    })
  }
}
>>>>>>> origin/master

// //---------------------------------------------------------
// //--------------- PARTICULAR STUDENT FEES DETAILS --------------------
// //---------------------------------------------------------

// async function getStudentFeesDetails(req, res) {
//   try{
//     const student_id = req.params.student_id;

//     const student_details = await Student.findOne({student_id});

//     let pending_students = await Academic.findOne({student_id: student_details._id})
//     .populate({
//       path: 'student_id',
//       select: '-_id student_id',
//       populate:[
//         {path: 'basic_info_id', select: 'full_name -_id'},
//         {path: 'contact_info_id', select: 'whatsapp_no address -_id'}
//       ]
//     })
//     .populate({
//       path: 'class_id', 
//       select: '-_id class_name medium stream batch_start_year batch_end_year is_active',
//       match:{
//         is_active : 1
//       }
//     })
//     .populate({
//       path: 'fees_id', 
//       select: '-_id -date -__v',
//       match:{
//         pending_amount: { $gt: 0}
//       }
//     });

//     pending_students = pending_students.filter((student)=>{
//       return student.fees_id != null && student.class_id != null;
//     })

//     if(!pending_students[0]){
//       return res.status(200).json({
//         success: true,
//         message: 'No students with pending fees',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data:{
//         pending_students
//       } ,
//     });
    
//   } catch(error){
//     res.status(404).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

//---------------------------------------------------------
//--------------- STUDENT FEES HISTORY --------------------
//---------------------------------------------------------

async function studentFessHistory(req, res){
  try{

    const student_id = req.prams.student_id;

    const student_details = await Student.findOne({student_id});

    const academic_details = await Academic.findOne({student_id: student_details._id})
    .populated({
      path: "class_id",
      match: {
        is_active: 1
      }
    });

    academic_details = academic_details.filter((academic)=>{
      return academic.class_id != null;
    });


    res.status(200).json({
      success: false,
      data: {
        academic_details
      },
    })
  }
  catch(error){
    res.status(404).json({
      success: false,
      message: error.message,
    })
  }  
} //Pending

module.exports = {
  getAllPendingStudentsFees,
  // getStudentFeesDetails,
  studentFessHistory,
};
