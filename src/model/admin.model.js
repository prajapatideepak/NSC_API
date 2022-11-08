const admin = require("../models/admin");
const staff = require("../models/staff");
const BasicInfo = require("../models/basicInfo");
const ContactInfo = require("../models/contactInfo");
const { populate, findOne, findOneAndUpdate } = require("../models/admin");
const basicInfo = require("../models/basicInfo");

async function insertAdmin(body) {
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
    security_pin: body.security_pin,
  });

  return adminData;
}

async function getAdminByUsername(u) {
  const adminData = await admin
    .findOne({ username: u })
    .select("password")
    .select("is_super_admin")
    .exec();

  return adminData;
}

async function updateAdminById(userID, data) {
  console.log(data);
  const { basic_info_id, contact_info_id } = data;
  const admins = await admin
    .findOne({ username: data.username })
    .populate("staff_id");

  const upateAdmin = await admin.findOneAndUpdate(
    { username: data.username },
    { security_pin: data.security_pin }
  );

  const updateBasicInfo = await BasicInfo.findOneAndUpdate(
    { _id: admins.staff_id.basic_info_id },
    { full_name: basic_info_id.full_name }
  );

  const updateContactInfo = await ContactInfo.findOneAndUpdate(
    { _id: admins.staff_id.contact_info_id },
    {
      email: contact_info_id.email,
      whatsapp_no: contact_info_id.whatsapp_no,
      alternative_no: contact_info_id.alternative_no,
      address: contact_info_id.address,
    }
  );

  return updateBasicInfo;
}

async function getAdminByid(id) {
  const adminData = await admin.findOne({ id: id }).exec();

  return adminData;
}

async function getAdminByUser(u) {
  const adminData = await admin
    .findOne({ username: u })
    .populate({
      path: "staff_id",
      populate: ["basic_info_id", "contact_info_id"],
    })
    .exec();

  return adminData;
}

async function ChangePassowrdByUsername(username, hasedPassword) {
  const result = await admin.findOneAndUpdate(
    { username: username },
    { password: hasedPassword }
  );
  return result;
}

async function changeAdminByUsername(username, data) {
  const result = await admin.findOneAndUpdate({ username: username }, data);
  return result;
}

async function getAllAdmin() {
  const adminData = await admin
    .find()
    .populate({
      path: "staff_id",
      populate: ["basic_info_id", "contact_info_id"],
    })
    .exec();

  return adminData;
}

module.exports = {
  insertAdmin,
  ChangePassowrdByUsername,
  getAdminByUsername,
  updateAdminById,
  getAdminByUser,
  getAllAdmin,
  getAdminByid,
  changeAdminByUsername,
};
