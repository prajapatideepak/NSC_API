const staffs = require('../../models/staff');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const transactions = require('../../models/transaction');
const salary_receipt = require('../../models/salaryReceipt');
const hourly_salary = require("../../models/hourlySalary");
const monthly_salary = require("../../models/monthlySalary")
const admin = require("../../models/admin")

const { default: mongoose } = require('mongoose');
const { populate } = require('../../models/admin');

function allSalary(req, res) {
    salary_receipt.find()
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

async function salaryFaculty(req, res) {
    try {

        const { is_by_cheque, is_by_cash, is_by_upi, cheque_no, upi_id, amount, date, is_hourly, total_hours, rate_per_hour, total_amount } = req.body

        const transaction_id = await transactions.findOne({ transaction_id: "631aed487eabd9fff109f5d1" })

        const staff_id = await staffs.findOne({ staff_id: "631822d6fc5b517b0390a360" });

        const admin_id = await admin.findOne({ admin_id: "6318229dfc5b517b0390a35a" });

        // const salaryreceipt_id = Math.floor(((Math.random() * 10000) + 1) + Math.random() * 1000);
        const salaryreceipts = await salary_receipt.find()

        const salaryreceipt_id = salaryreceipts.length + 1;
        
        console.log(salaryreceipt_id)

        const Salary = await transactions.create({
            is_by_cheque, is_by_cash, is_by_upi, cheque_no, upi_id, amount, date
        });

        const salaryreceipt = await salary_receipt.create({
            salary_receipt_id: salaryreceipt_id,
            staff_id: staff_id.id,
            admin_id: admin_id.id,
            transaction_id: transaction_id.id,
            is_hourly

        })

        const reciept_id = await salary_receipt.findOne({ reciept_id: salaryreceipt_id })

        if (is_hourly == 1) {
            const hourlysalary = await hourly_salary.create({
                salary_receipt_id: reciept_id,
                total_hours,
                rate_per_hour,
                total_amount
            })
        } else {

            const monthlysalary = await monthly_salary.create({
                salary_receipt_id: reciept_id,
                total_amount
            })
        }



        res.status(201).json('Data Inserted of salary reciept');
    } catch (error) {
        res.status(500).json(error + " " + error.message);
    }
}


async function getsalary(req, res) {
    try {
        let salary_details;
        let staff_details;
        let staff_basic_details
        const getdetails = await salary_receipt.findOne({salary_receipt_id : req.params.salary_receipt_id });
        
        if (getdetails.is_hourly == 1) {
            staff_details = await staffs.findOne({ staff_id : getdetails._id}).populate("basic_info_id").populate("contact_info_id")
            salary_details = await hourly_salary.findOne({salary_receipt_id: getdetails._id})
            console.log(staff_details)
            
            
        } else {
            staff_details = await staffs.findOne( {staff_id: getdetails._id})
            staff_details = await staffs.findOne({ staff_id : getdetails._id}).populate("basic_info_id").populate("contact_info_id")
            staff_basic_details = await staffs.findOne({basic_info_id : staff_details})
        };

        res.status(200).json({
            success: true,
            data: {
                receipt_details: getdetails,
                salary_details,
                staff_details

            }
        });


      } catch (error) {
        return res.status(500).send(error.stack);
      }
    // const getdetails = salary_receipt.findById(req.params.id)
    // .populate("salary_receipt_id");

   

}


module.exports = {
    salaryFaculty,
    allSalary,
    getsalary

};










































