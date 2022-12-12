const staffs = require("../../models/staff");
const BasicInfo = require("../../models/basicinfo");
const FeesReceipt = require("../../models/feesReceipt");
const ContactInfo = require("../../models/contactinfo");
const transactions = require("../../models/transaction");
const salary_receipt = require("../../models/salaryReceipt");
const hourly_salary = require("../../models/hourlySalary");
const monthly_salary = require("../../models/monthlySalary")
const Admin = require("../../models/admin")
const bcrypt = require('bcrypt');

const { default: mongoose } = require("mongoose");
const { populate } = require("../../models/admin");

// ---------------------------------------------------
//-------------- ALL SALARY RECIEPT ------------------
// ---------------------------------------------------
function allSalary(req, res) {
    salary_receipt.find()
        .then(result => {
            res.status(200).json({
                recieptdata: result
            });

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

// ---------------------------------------------------
//-------------- GENERATE SALARY RECIEPT ------------------
// ---------------------------------------------------
async function salaryFaculty(req, res) {
    try {
        const { is_by_cheque, is_by_cash, is_by_upi, cheque_no, upi_no, amount, is_hourly, total_hours, rate_per_hour, total_amount, staff_id, admin, } = req.body
        const admin_details = await Admin.findOne({ username: admin })
        
        const salaryreceipts = await salary_receipt.find()
        const fees_receipts = await FeesReceipt.find();
        const salaryreceipt_id =
        fees_receipts.length + salaryreceipts.length + 1 + 1000;

        const Salary = await transactions.create({
            is_by_cheque, is_by_cash, is_by_upi, cheque_no, upi_no, amount
        });

        const salaryreceipt = await salary_receipt.create({
            salary_receipt_id: salaryreceipt_id,
            staff_id: staff_id,
            admin_id: admin_details,
            transaction_id: Salary,
            is_hourly: is_hourly

        })

        let hourlysalary
        let monthlysalary
        if (is_hourly == 1) {
            hourlysalary = await hourly_salary.create({
                salary_receipt_id: salaryreceipt._id,
                total_hours,
                rate_per_hour,
                total_amount
            })
        } else {

            monthlysalary = await monthly_salary.create({
                salary_receipt_id: salaryreceipt._id,
                total_amount
            })
        }



        res.status(201).json({
            success: true,
            data: { salaryreceipt, hourlysalary, monthlysalary },

            message: "Successfully regiser"
        });
    } catch (error) {
        res.status(500).json(error + " " + error.message);
    }
}

// -------------------------------------------------------------------------------------------
// -------------- SINGLE FACULTY SALARY DETAILS SEARCH BY FACULTY ID  ------------------------
// ------------------------------------------------------------------------------------------
// async function getFaculty(req, res) {

//     try {

//         let staff_Details;
//         staff_Details = await salary_receipt.find({ staff_id: req.params.id })
//             .populate("transaction_id").populate({ path: "staff_id", populate: ["basic_info_id", "contact_info_id"] })
//         res.status(200).json({
//             success: true,

//             staff_Details,


//         });
//     } catch (error) {
//         return res.status(500).send(error.stack);
//     }
// }

// ------------------------------------------------------------------------------------------
// -------------- SINGLE FACULTY TOTAL SALARY RECIEPT  --------------------------------------
// ------------------------------------------------------------------------------------------
async function getFacultyhistory(req, res) {
    try {

        let staff_History;
        staff_History = await salary_receipt.find({ staff_id: req.params.id }).populate("admin_id").populate("transaction_id").populate("staff_id")

        res.status(200).json({
            success: true,

            staff_History

        });
    } catch (error) {
        return res.status(500).send(error.stack);
    }
}

// ---------------------------------------------------------------------------
//-------------- SALARY RECIEPT SEARCH BY SALARY RECIEPT ID  ------------------
// ---------------------------------------------------------------------------
async function getsalary(req, res) {
    try {
        let hourlysalary;
        let monthlysalary;
        let staff_details;
        const getdetails = await salary_receipt.findOne({ salary_receipt_id: req.params.salary_receipt_id })
            .populate("transaction_id")
            .populate({ path: "staff_id", populate: ["basic_info_id", "contact_info_id"] })
            .populate({ path: "admin_id", populate: ["staff_id"] })
        if (getdetails.is_hourly == 1) {
            hourlysalary = await hourly_salary.findOne({ salary_receipt_id: getdetails._id })
        } else {
            monthlysalary = await monthly_salary.findOne({ salary_receipt_id: getdetails._id })
        };

        res.status(200).json({
            success: true,
            data: {
                receipt_details: { getdetails, hourlysalary, monthlysalary }


            }
        });


    } catch (error) {
        return res.status(500).send(error.stack);
    }
}

// ---------------------------------------------------
//----------- UPDATE SALARY RECIEPT ------------------
// ---------------------------------------------------
async function updateStaffReceipt(req, res, next) {
  try {
    const salary_receipt_id = req.params.salary_receipt_id;
    const {
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      total_hours,
      is_hourly,
      rate_per_hour,
      cheque_no,
      upi_no,
      amount,
      admin_id,
    } = req.body;

    const salary_receipt_details = await salary_receipt.findOneAndUpdate(
      { salary_receipt_id },
      {
        admin_id,
        is_hourly,
        date: Date.now(),
      }
    );

    if (salary_receipt_details.is_hourly && is_hourly) {
      const hourly_salary_details = await hourly_salary.findOneAndUpdate(
        { salary_receipt_id: salary_receipt_details._id },
        {
          total_hours,
          rate_per_hour,
          total_amount: amount,
        }
      );
    } else if (salary_receipt_details.is_hourly && !is_hourly) {
      await hourly_salary.deleteOne({
        salary_receipt_id: salary_receipt_details._id,
      });
      await monthly_salary.create({
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    } else if (!salary_receipt_details.is_hourly && is_hourly) {
      await monthly_salary.deleteOne({
        salary_receipt_id: salary_receipt_details._id,
      });
      await hourly_salary.create({
        total_hours,
        rate_per_hour,
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    } else {
      const monthly_salary_details = await monthly_salary.findOneAndUpdate(
        { salary_receipt_id: salary_receipt_details._id },
        {
          total_amount: amount,
        }
      );
    }

    const transaction_details = await transactions.findByIdAndUpdate(
      salary_receipt_details.transaction_id,
      {
        is_by_cheque,
        is_by_cash,
        is_by_upi,
        cheque_no: cheque_no ? cheque_no : -1,
        upi_no: upi_no ? upi_no : "",
        amount,
        date: Date.now(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Receipt Updated successfully",
      salary_receipt_details,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    salaryFaculty,
    allSalary,
    getsalary,
    updateStaffReceipt,
    // getFaculty,
    getFacultyhistory,
};
