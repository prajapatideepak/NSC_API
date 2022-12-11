const Student = require("../../models/student");
const BasicInfo = require("../../models/basicinfo");
const ContactInfo = require("../../models/contactinfo");
const Fees = require("../../models/fees");
const Academic = require("../../models/academic");
const Admin = require("../../models/admin");
const FeesReceipt = require("../../models/feesReceipt");
const Staff = require("../../models/staff");
const SalaryReceipt = require("../../models/salaryReceipt");
const HourlySalary = require("../../models/hourlySalary");
const MonthlySalary = require("../../models/monthlySalary");
const Transaction = require("../../models/transaction");
const bcrypt = require("bcrypt");

//-------------------------------------------------------------
//------------------ GENERATE STUDENT RECEIPT -----------------
//-------------------------------------------------------------
const generateReceiptFunction = async (
  student_id,
  is_by_cash,
  is_by_cheque,
  is_by_upi,
  amount,
  discount,
  cheque_no,
  upi_no,
  admin_id,
  security_pin
) => {
  const admin_details = await Admin.findById(admin_id);
  
  const isMatch = admin_details.security_pin == security_pin;

  if(!isMatch) {
      return false;
  }

  const student_details = await Student.findOne({ student_id });

  const academic_details = await Academic.findOne({
    student_id: student_details._id,
    is_transferred: 0
  })
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
      },
    })
    .limit(1);

  const net_amount = amount - discount;

  const transaction_details = await Transaction.create({
    is_by_cash,
    is_by_cheque,
    is_by_upi,
    cheque_no: cheque_no != "" ? cheque_no : -1,
    upi_no: upi_no != "" ? upi_no : "",
    amount: net_amount,
  });

  const fees_receipts = await FeesReceipt.find();
  const salary_receipts = await SalaryReceipt.find();
  const fees_receipt_id =
    fees_receipts.length + salary_receipts.length + 1 + 1000;

  const fees_receipt_details = await FeesReceipt.create({
    fees_receipt_id,
    fees_id: academic_details.fees_id,
    admin_id: admin_details._id,
    transaction_id: transaction_details._id,
    discount,
  });

  //updating pending amount of student in fees table
  await Fees.findOneAndUpdate(
    { _id: academic_details.fees_id },
    { $inc: { pending_amount: -amount } }
  );

  return fees_receipt_details;
};

async function generateStudentReceipt(req, res, next) {
  try {
    const {
      student_id,
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      amount,
      discount,
      cheque_no,
      upi_no,
      admin_id,
      security_pin,
    } = req.body;
    const fees_receipt_details = await generateReceiptFunction(
      student_id,
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

    if (fees_receipt_details == false) {
      return res.status(200).json({
        success: false,
        message: "*Incorrect security pin",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Receipt generated successfully",
        data: {
          fees_receipt_details,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

//-------------------------------------------------------------
//------------------ GENERATE STAFF RECEIPT -------------------
//-------------------------------------------------------------
async function generateStaffReceipt(req, res, next) {
  try {
    const {
      staff_id,
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      is_hourly,
      total_hours,
      rate_per_hour,
      cheque_no,
      upi_no,
      amount,
      admin_username,
      admin_security_pin,
    } = req.body;

    const admin_details = await Admin.findOne({ username: admin_username });
    const isMatch = await bcrypt.compare(
      admin_security_pin,
      admin_details.security_pin
    );

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Incorrect security pin",
      });
    }

    const transaction_details = await Transaction.create({
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      cheque_no: cheque_no ? cheque_no : -1,
      upi_no: upi_no ? upi_no : "",
      amount,
    });

    const fees_receipts = await FeesReceipt.find();
    const salary_receipts = await SalaryReceipt.find();
    const salary_receipt_id =
      fees_receipts.length + salary_receipts.length + 1 + 1000;

    const salary_receipt_details = await SalaryReceipt.create({
      salary_receipt_id,
      is_hourly: is_hourly ? 1 : 0,
      staff_id,
      admin_id: admin_details._id,
      transaction_id: transaction_details._id,
    });

    if (is_hourly) {
      await HourlySalary.create({
        total_hours,
        rate_per_hour,
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    } else {
      await MonthlySalary.create({
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Receipt generated successfully",
      data: {
        salary_receipt_details,
      },
    });
  } catch (error) {
    next(error);
  }
}

//-------------------------------------------------------------
//-------------------- UPDATE STUDENT RECEIPT -------------------
//-------------------------------------------------------------
async function updateStudentReceipt(req, res, next) {
  try {
    const fees_receipt_id = req.params.fees_receipt_id;

    const {
      is_by_cash,
      is_by_cheque,
      is_by_upi,
      cheque_no,
      upi_no,
      amount,
      discount,
      security_pin,
      admin_id,
    } = req.body;

    const admin_details = await Admin.findById(admin_id);

    const isMatch = security_pin == admin_details.security_pin;

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid PIN",
      });
    }

    const net_amount = amount - discount;

    const receipt_details = await FeesReceipt.findOneAndUpdate(
      { fees_receipt_id },
      {
        admin_id: admin_details._id,
        discount,
        date: Date.now(),
      }
    );

    const transaction_details = await Transaction.findByIdAndUpdate(
      receipt_details.transaction_id,
      {
        is_by_cash,
        is_by_cheque,
        is_by_upi,
        cheque_no: cheque_no ? cheque_no : -1,
        upi_no: upi_no ? upi_no : "",
        amount: net_amount,
      }
    );

    //updating pending amount of student in fees table
    const old_discount = receipt_details.discount;
    const pending_amount = transaction_details.amount + old_discount - amount;

    await Fees.findOneAndUpdate(
      { _id: receipt_details.fees_id },
      { $inc: { pending_amount: pending_amount } }
    );

    res.status(200).json({
      success: true,
      message: "Receipt Updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

//-------------------------------------------------------------
//------------------ UPDATE STAFF RECEIPT -------------------
//-------------------------------------------------------------
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
      security_pin,
    } = req.body;

    const admin_details = await Admin.findById(admin_id);

    const isMatch = await bcrypt.compare(
      security_pin,
      admin_details.security_pin
    );

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Please enter valid PIN",
      });
    }

    const salary_receipt_details = await SalaryReceipt.findOneAndUpdate(
      { salary_receipt_id },
      {
        admin_id: admin_details._id,
        is_hourly,
        date: Date.now(),
      }
    );

    if (salary_receipt_details.is_hourly && is_hourly) {
      const hourly_salary_details = await HourlySalary.findOneAndUpdate(
        { salary_receipt_id: salary_receipt_details._id },
        {
          total_hours,
          rate_per_hour,
          total_amount: amount,
        }
      );
    } else if (salary_receipt_details.is_hourly && !is_hourly) {
      await HourlySalary.deleteOne({
        salary_receipt_id: salary_receipt_details._id,
      });
      await MonthlySalary.create({
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    } else if (!salary_receipt_details.is_hourly && is_hourly) {
      await MonthlySalary.deleteOne({
        salary_receipt_id: salary_receipt_details._id,
      });
      await HourlySalary.create({
        total_hours,
        rate_per_hour,
        total_amount: amount,
        salary_receipt_id: salary_receipt_details._id,
      });
    } else {
      const monthly_salary_details = await MonthlySalary.findOneAndUpdate(
        { salary_receipt_id: salary_receipt_details._id },
        {
          total_amount: amount,
        }
      );
    }

    const transaction_details = await Transaction.findByIdAndUpdate(
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
    });
  } catch (error) {
    next(error);
  }
}

//-----------------------------------------------------------------------------------
//------ SEARCH RECEIPT BY RECEIPT ID, STUDENT ID, STUDENT NAME, WHATSAPP NO --------
//-----------------------------------------------------------------------------------
async function searchReceipt(req, res, next) {
  try {
    let receipt_params = req.params.value;
    let student_receipts = [];
    let staff_receipts = [];

    // Getting student details for student receipt
    let student_data = await Student.aggregate([
      { $match: { is_cancelled: 0 } },
      {
        $lookup: {
          from: "basic_infos",
          localField: "basic_info_id",
          foreignField: "_id",
          as: "basic_info",
        },
      },
      {
        $lookup: {
          from: "contact_infos",
          localField: "contact_info_id",
          foreignField: "_id",
          as: "contact_info",
        },
      },
      {
        $lookup: {
          from: "academics",
          localField: "_id",
          foreignField: "student_id",
          as: "academics",
          let: { class_id: "class_id" },
          pipeline: [
            { $match: {is_transferred: 0} },
            {
              $lookup: {
                from: "classes",
                localField: "class_id",
                foreignField: "_id",
                as: "class",
                pipeline: [
                  {
                    $match: {
                      is_active: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "fees",
                localField: "fees_id",
                foreignField: "_id",
                as: "fees",
                pipeline: [
                  {
                    $lookup: {
                      from: "fees_receipts",
                      localField: "_id",
                      foreignField: "fees_id",
                      as: "fees_receipt",
                      pipeline: [
                        {
                          $lookup: {
                            from: "transactions",
                            localField: "transaction_id",
                            foreignField: "_id",
                            as: "transaction",
                          },
                        },
                        {
                          $lookup: {
                            from: "admins",
                            localField: "admin_id",
                            foreignField: "_id",
                            as: "admin",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);

    student_receipts = student_data.filter(function (item) {
      const student_full_name = item?.basic_info[0]?.full_name?.toLowerCase();
      let isStudentNameFound = false;

      if (isNaN(receipt_params)) {
        receipt_params = receipt_params.toLowerCase();
      }

      if (student_full_name?.indexOf(receipt_params) > -1) {
        isStudentNameFound = true;
      }

      let isReceiptFound = false;

      //Finding receipts from receipt_id
      let receipts;
      if (
        item?.academics[0]?.fees[0]?.fees_receipt[0] &&
        !isNaN(receipt_params)
      ) {
        receipts = item.academics[0].fees[0].fees_receipt.filter((item) => {
          if (item.fees_receipt_id == receipt_params) {
            isReceiptFound = true;
            return item;
          }
        });
      }

      if (isReceiptFound) {
        item.academics[0].fees[0].fees_receipt = receipts;
        return item;
      }

      return (
        item.student_id == receipt_params ||
        isStudentNameFound ||
        item?.contact_info[0]?.whatsapp_no == receipt_params
      );
    });

    // Getting staff details for staff receipt
    let staff_data = await Staff.aggregate([
      { $match: { is_cancelled: 0 } },
      {
        $lookup: {
          from: "basic_infos",
          localField: "basic_info_id",
          foreignField: "_id",
          as: "basic_info",
        },
      },
      {
        $lookup: {
          from: "contact_infos",
          localField: "contact_info_id",
          foreignField: "_id",
          as: "contact_info",
        },
      },
      {
        $lookup: {
          from: "salary_receipts",
          localField: "_id",
          foreignField: "staff_id",
          as: "salary_receipt",
          let: { class_id: "class_id" },
          pipeline: [
            {
              $lookup: {
                from: "transactions",
                localField: "transaction_id",
                foreignField: "_id",
                as: "transaction",
              },
            },
            {
              $lookup: {
                from: "admins",
                localField: "admin_id",
                foreignField: "_id",
                as: "admin",
              },
            },
            {
              $lookup: {
                from: "hourly_salarys",
                localField: "_id",
                foreignField: "salary_receipt_id",
                as: "hourly_salary",
              },
            },
            {
              $lookup: {
                from: "monthly_salarys",
                localField: "_id",
                foreignField: "salar_receipt_id",
                as: "monthly_salary",
              },
            },
          ],
        },
      },
    ]);

    staff_receipts = staff_data.filter(function (item) {
      const staff_full_name = item?.basic_info[0]?.full_name?.toLowerCase();
      let isStaffNameFound = false;

      if (isNaN(receipt_params)) {
        receipt_params = receipt_params.toLowerCase();
      }

      if (staff_full_name?.indexOf(receipt_params) > -1){
        isStaffNameFound = true;
      }

      let isReceiptFound = false

      //Finding receipts from receipt_id
      let receipts;
      if(item?.salary_receipt[0] && !isNaN(receipt_params)){
        receipts = item.salary_receipt.filter((item)=>{
          if(item.salary_receipt_id == receipt_params){
              isReceiptFound = true;
              return item;
          }
        })
      }

      if(isReceiptFound){
        item.salary_receipt = receipts;
        return item
      }

      return isStaffNameFound || item?.contact_info[0]?.whatsapp_no == receipt_params;
    });
      

    if (!staff_data[0] && !student_data[0]) {
      return res.status(200).json({
        success: false,
        message: "No Receipt found",
      });
    }

    res.status(200).json({
      status: true,
      student_receipts,
      staff_receipts,
    });
  
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateStudentReceipt,
  generateStaffReceipt,
  updateStudentReceipt,
  updateStaffReceipt,
  searchReceipt,
  generateReceiptFunction,
};
