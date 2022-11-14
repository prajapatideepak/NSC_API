const Student = require("../../models/student");
const BasicInfo = require("../../models/basicinfo");
const ContactInfo = require("../../models/contactinfo");
const Fees = require("../../models/fees");
const Academic = require("../../models/academic");
const Classes = require("../../models/classes");
const FeesReceipt = require("../../models/feesReceipt");
const { generateReceiptFunction } = require("../receipt/receipt.controller");

//---------------------------------------------------------
//--------------- PENDING STUDENTS FEES -------------------
//---------------------------------------------------------

async function getAllPendingStudentsFees(req, res, next) {
  try {
    const is_primary = req.params.is_primary;
    let pending_students = await Academic.find()
      .populate({
        path: "student_id",
        select: "-_id student_id",
        populate: [
          { path: "basic_info_id", select: "full_name -_id" },
          { path: "contact_info_id", select: "whatsapp_no address -_id" },
        ],
      })
      .populate({
        path: "class_id",
        select:
          "-_id class_name medium stream batch_start_year batch_end_year is_active",
        match: {
          is_active: 1,
          is_primary,
        },
      })
      .populate({
        path: "fees_id",
        select: "-_id -date -__v",
        match: {
          pending_amount: { $gt: 0 },
        },
      });

    pending_students = pending_students.filter((student) => {
      return student.fees_id != null && student.class_id != null;
    });

    if (!pending_students[0]) {
      return res.status(200).json({
        success: false,
        message: "No students with pending fees",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        pending_students,
      },
    });
  } catch (error) {
    next(error);
  }
}

// //---------------------------------------------------------
// //--------------- PARTICULAR STUDENT FEES DETAILS --------------------
// //---------------------------------------------------------

// async function getStudentFeesDetails(req, res, next) {
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
// }     throw new Error('No students with pending fees');
//     }

//     res.status(200).json({
//       success: true,
//       data:{
//         pending_students
//       } ,
//     });

//   } catch(error){
//     next(error);
//   }
// }

//---------------------------------------------------------
//------- PARTICULAR STUDENTS ALL ACADEMIC DETAILS --------
//---------------------------------------------------------
async function studentAllAcademicDetails(req, res, next) {
  try {
    const student_id = req.params.student_id;

    const student_details = await Student.findOne({ student_id });

    const academic_details = await Academic.find({
      student_id: student_details._id,
    })
      .populate({
        path: "class_id",
      })
      .populate({
        path: "fees_id",
      })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      academic_details,
    });
  } catch (error) {
    next(error);
  }
}

//---------------------------------------------------------
//------------ TRANSFER FEES TO ANOTHER STUDENT -----------
//---------------------------------------------------------

async function transferFeesToStudent(req, res, next) {
  try {
    const { payer_fees_id, payee_id, amount, admin_id, security_pin } =
      req.body;
    const is_by_cash = 1;
    const is_by_cheque = 0;
    const is_by_upi = 0;
    const cheque_no = -1;
    const upi_no = "-1";
    const discount = 0;

    //---------generating Student Receipt--------
    const result = await generateReceiptFunction(
      payee_id,
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      amount,
      discount,
      cheque_no,
      upi_no,
      admin_id,
      security_pin
    );

    if (result == false) {
      return res.status(200).json({
        success: false,
        message: "Incorrect security pin",
      });
    }

    //-------Deduct amount from payers fees-----
    const fees_details = await Fees.findByIdAndUpdate(
      payer_fees_id,
      {
        $inc: { pending_amount: amount },
      },
      { returnOriginal: false, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Fees successfully transferred",
      fees_details,
    });
  } catch (error) {
    next(error);
  }
}

//---------------------------------------------------------
//--------------- STUDENT FEES HISTORY --------------------
//---------------------------------------------------------

async function studentFeesHistory(req, res, next) {
  try {
    const academic_id = req.params.academic_id;

    const academic_details = await Academic.findById(academic_id);

    const fees_details = await Fees.findById(academic_details.fees_id);

    const all_receipts = await FeesReceipt.find({ fees_id: fees_details._id })
      .populate("admin_id")
      .populate("transaction_id");

    res.status(200).json({
      success: true,
      all_receipts,
    });
  } catch (error) {
    next(error);
  }
} //Pending

module.exports = {
  getAllPendingStudentsFees,
  // getStudentFeesDetails,
  studentFeesHistory,
  studentAllAcademicDetails,
  transferFeesToStudent,
};
