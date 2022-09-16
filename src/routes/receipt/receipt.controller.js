const Student = require('../../models/student');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const Fees = require('../../models/fees');
const Academic = require('../../models/academic');
const Classes = require('../../models/classes');
const FeesReceipt = require('../../models/feesReceipt');
const Staff = require('../../models/staff');
const SalaryReceipt = require('../../models/salaryReceipt');
const HourlySalary = require('../../models/hourlySalary');
const MonthlySalary = require('../../models/monthlySalary');
const Transaction = require('../../models/transaction');

//-------------------------------------------------------------
//------------------ GENERATE STUDENT RECEIPT -----------------
//-------------------------------------------------------------
async function generateStudentReceipt(req, res) {
    try{
        const {student_id, is_by_cash, is_by_cheque, is_by_upi, amount} = req.body;

        const student_details = await Student.findOne({student_id});

        const admin_id = '632324e55f67f65bf8a5f53a';

        const academic_details = await Academic.findOne({student_id: student_details._id})
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
        .limit(1);

        const transaction_details = await Transaction.create({
            is_by_cash,
            is_by_cheque,
            is_by_upi,
            amount
        })

        const receipts = await FeesReceipt.find();
        const fees_receipt_id = (receipts.length + 1) + 1000;

        const fees_receipt_details = await FeesReceipt.create({
            fees_receipt_id,
            fees_id: academic_details.fees_id,
            admin_id,
            transaction_id: transaction_details._id
        })

        //updating pending amount of student in fees table
        await Fees.findOneAndUpdate({_id:academic_details.fees_id}, { $inc: { pending_amount: - amount } });

        res.status(200).json({
            success: true,
            message: 'Receipt generated successfully',
            data: {
                fees_receipt_details
            }
        })
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

//-------------------------------------------------------------
//------------------ GENERATE STAFF RECEIPT -------------------
//-------------------------------------------------------------
async function generateStaffReceipt(req, res) {
    try{
        const {staff_id, is_by_cash, is_by_cheque, is_by_upi, is_hourly, total_hours, rate_per_hour, cheque_no, upi_no, amount } = req.body;

        const staff_details = await Staff.findById(staff_id);
        
        const admin_id = '632324e55f67f65bf8a5f53a';

        const transaction_details = await Transaction.create({
            is_by_cash,
            is_by_cheque,
            is_by_upi,
            cheque_no: cheque_no && -1,
            upi_no: upi_no && -1,
            amount
        })

        const receipts = await FeesReceipt.find();
        const salary_receipt_id = (receipts.length + 1) + 1000;

        const salary_receipt_details = await SalaryReceipt.create({
            salary_receipt_id,
            is_hourly: is_hourly && 0,
            staff_id,
            admin_id,
            transaction_id: transaction_details._id
        })

        if(is_hourly){
            await HourlySalary.create({
                total_hours,
                rate_per_hour,
                total_amount: amount,
                salary_receipt_id: salary_receipt_details._id
            })
        }
        else{
            await MonthlySalary.create({
                total_amount: amount,
                salary_receipt_id: salary_receipt_details._id
            })
        }

        res.status(200).json({
            success: true,
            message: 'Receipt generated successfully',
            data: {
                salary_receipt_details
            }
        })
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

//-------------------------------------------------------------
//-------------------- UPDATE STAFF RECEIPT -------------------
//-------------------------------------------------------------

//-------------------------------------------------------------
//------------------ UPDATE STUDENT RECEIPT -------------------
//-------------------------------------------------------------


module.exports = {
    generateStudentReceipt,
    generateStaffReceipt
}
