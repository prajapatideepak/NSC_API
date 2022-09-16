const Student = require('../../models/student');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const Fees = require('../../models/fees');
const Academic = require('../../models/academic');
const Admin = require('../../models/admin');
const FeesReceipt = require('../../models/feesReceipt');
const Staff = require('../../models/staff');
const SalaryReceipt = require('../../models/salaryReceipt');
const HourlySalary = require('../../models/hourlySalary');
const MonthlySalary = require('../../models/monthlySalary');
const Transaction = require('../../models/transaction');
const bcrypt = require('bcrypt');

//-------------------------------------------------------------
//------------------ GENERATE STUDENT RECEIPT -----------------
//-------------------------------------------------------------
async function generateStudentReceipt(req, res) {
    try{
        const {student_id, is_by_cash, is_by_cheque, is_by_upi, amount, discount, cheque_no, upi_no, admin_username, admin_security_pin} = req.body;

        const admin_details = await Admin.findOne({username: admin_username})
        const isMatch = await bcrypt.compare(admin_security_pin, admin_details.security_pin);

        if(!isMatch) {
            return res.status(200).json({status: false, message: 'Incorrect security pin'});
        }

        const student_details = await Student.findOne({student_id});

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

        const net_amount = amount - discount;

        const transaction_details = await Transaction.create({
            is_by_cash,
            is_by_cheque,
            is_by_upi,
            cheque_no: cheque_no ? cheque_no : -1,
            upi_no: upi_no ? upi_no : "",
            amount: net_amount,
        })

        const fees_receipts = await FeesReceipt.find();
        const salary_receipts = await SalaryReceipt.find();
        const fees_receipt_id = (fees_receipts.length  + salary_receipts.length ) + 1 + 1000;

        const fees_receipt_details = await FeesReceipt.create({
            fees_receipt_id,
            fees_id: academic_details.fees_id,
            admin_id: admin_details._id,
            transaction_id: transaction_details._id,
            discount
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
        const {staff_id, is_by_cash, is_by_cheque, is_by_upi, is_hourly, total_hours, rate_per_hour, cheque_no, upi_no, amount, admin_username, admin_security_pin } = req.body;

        const admin_details = await Admin.findOne({username: admin_username})
        const isMatch = await bcrypt.compare(admin_security_pin, admin_details.security_pin);

        if(!isMatch) {
            return res.status(200).json({status: false, message: 'Incorrect security pin'});
        }

        const transaction_details = await Transaction.create({
            is_by_cash,
            is_by_cheque,
            is_by_upi,
            cheque_no: cheque_no ? cheque_no : -1,
            upi_no: upi_no ? upi_no : "",
            amount
        })

        const fees_receipts = await FeesReceipt.find();
        const salary_receipts = await SalaryReceipt.find();
        const salary_receipt_id = (fees_receipts.length  + salary_receipts.length ) + 1 + 1000;

        const salary_receipt_details = await SalaryReceipt.create({
            salary_receipt_id,
            is_hourly: is_hourly ? 1 : 0,
            staff_id,
            admin_id: admin_details._id,
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
//-------------------- UPDATE STUDENT RECEIPT -------------------
//-------------------------------------------------------------
async function updateStudentReceipt(req, res){
    try{
        const fees_receipt_id = req.params.fees_receipt_id;

        const {is_by_cash, is_by_cheque, is_by_upi, cheque_no, upi_no, amount, discount, super_admin_username, super_admin_password} = req.body;

        const admin_details = await Admin.findOne({username: super_admin_username, is_super_admin: 1}).select('password');
        const isMatch = await bcrypt.compare(super_admin_password, admin_details.password);

        if(!isMatch) {
            return res.status(200).json({status: false, message: 'Incorret Username or Password'});
        }

        const net_amount = amount - discount;
        
        const receipt_details = await FeesReceipt.findOneAndUpdate({fees_receipt_id},{
            admin_id: admin_details._id,
            discount,
            date: Date.now()
        });

        const transaction_details = await Transaction.findByIdAndUpdate(receipt_details.transaction_id,{
            is_by_cash,
            is_by_cheque,
            is_by_upi,
            cheque_no: cheque_no ? cheque_no : -1,
            upi_no: upi_no ? upi_no : "",
            amount: net_amount,
        });

        //updating pending amount of student in fees table
        const old_discount = receipt_details.discount;
        const pending_amount = (transaction_details.amount + old_discount) - amount;

        await Fees.findOneAndUpdate({_id:receipt_details.fees_id}, { $inc: { pending_amount: pending_amount } });
        
        res.status(200).json({
            success: true,
            message: 'Receipt Updated successfully',
        });
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

//-------------------------------------------------------------
//------------------ UPDATE STAFF RECEIPT -------------------
//-------------------------------------------------------------
async function updateStaffReceipt(req, res){
    try{
        const salary_receipt_id = req.params.salary_receipt_id;

        const {is_by_cash, is_by_cheque, is_by_upi, total_hours, is_hourly, rate_per_hour, cheque_no, upi_no, amount, super_admin_username, super_admin_password } = req.body;

        const admin_details = await Admin.findOne({username: super_admin_username, is_super_admin: 1}).select('password');
        const isMatch = await bcrypt.compare(super_admin_password, admin_details.password);
        
        if(!isMatch) {
            return res.status(200).json({status: false, message: 'Incorret Username or Password'});
        }

        const salary_receipt_details = await SalaryReceipt.findOneAndUpdate({salary_receipt_id},{
            admin_id: admin_details._id,
            is_hourly,
            date: Date.now()
        });

        if(salary_receipt_details.is_hourly && is_hourly){
            const hourly_salary_details = await HourlySalary.findOneAndUpdate({salary_receipt_id: salary_receipt_details._id},{
                total_hours,
                rate_per_hour,
                total_amount: amount
            });
        }
        else if(salary_receipt_details.is_hourly && !is_hourly){
            await HourlySalary.deleteOne({salary_receipt_id: salary_receipt_details._id});
            await MonthlySalary.create({
                total_amount: amount,
                salary_receipt_id: salary_receipt_details._id
            })
        }
        else if(!salary_receipt_details.is_hourly && is_hourly){
            await MonthlySalary.deleteOne({salary_receipt_id: salary_receipt_details._id});
            await HourlySalary.create({
                total_hours,
                rate_per_hour,
                total_amount: amount,
                salary_receipt_id: salary_receipt_details._id
            })
        }
        else {
            const monthly_salary_details = await MonthlySalary.findOneAndUpdate({salary_receipt_id: salary_receipt_details._id},{
                total_amount: amount
            });
        }

        const transaction_details = await Transaction.findByIdAndUpdate(salary_receipt_details.transaction_id,{
            is_by_cheque,
            is_by_cash, 
            is_by_upi,
            cheque_no: cheque_no ? cheque_no : -1,
            upi_no: upi_no ? upi_no : "",
            amount,
            date: Date.now()
        })
        
        res.status(200).json({
            success: true,
            message: 'Receipt Updated successfully',
        })
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

//-----------------------------------------------------------------------------------
//------ SEARCH RECEIPT BY RECEIPT ID, STUDENT ID, STUDENT NAME, WHATSAPP NO --------
//-----------------------------------------------------------------------------------
async function searchReceipt(req, res){
    try{
        const receipt_params = req.params.value;

        
    }
    catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    generateStudentReceipt,
    generateStaffReceipt,
    updateStudentReceipt,
    updateStaffReceipt,
    searchReceipt
}
