const admin = require("../models/admin");
const staff = require("../models/staff");
const BasicInfo = require("../models/basicInfo");
const ContactInfo = require("../models/contactInfo");

async function insertAdmin(body) {
  console.log(body);
  const basic_info_id = await BasicInfo.create({
    photo: body.photo,
    full_name: body.full_name,
    gender: body.gender,
    dob: body.dob,
  });

  const contact_info_id = await ContactInfo.create({
    whatsapp_no: body.whatsapp_no,
    alternative_no: body.alternative_no,
    email: body.email,
    address: body.address,
  });

  const staff_info_id = await staff.create({
    basic_info_id: basic_info_id._id,
    contact_info_id: contact_info_id._id,
    joining_date: new Date(),
  });

  const adminData = await admin.create({
    username: body.username,
    password: body.password,
    staff_id: staff_info_id._id,
    is_super_admin: body.is_super_admin,
  });

  return adminData;
}

async function getAdminByUsername(u) {
  const adminData = await admin
    .findOne({ username: u })
    .select("password")
    .exec();

  console.log(adminData);
  return adminData;
}

async function updateAdminById(_id, data) {
  const result = await admin.findOneAndUpdate({ id: _id }, data);
  
  return result;
}

async function getAdminByid(id) {
  const adminData = await admin.findOne({ id: id }).exec();

  return adminData;
}

module.exports = {
  insertAdmin,
  getAdminByUsername,
  updateAdminById,
  getAdminByid,
};
