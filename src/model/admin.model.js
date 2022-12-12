const admin = require("../models/admin");
const staff = require("../models/staff");
const contactinfo = require("../models/contactinfo");
const { populate, findone, findoneandupdate } = require("../models/admin");
const basicinfo = require("../models/basicinfo");

async function insertadmin(body) {
  const basic_info_id = await basicinfo.create({
    photo: "user_default@123.png",
    full_name: body.full_name,
    gender: body.gender,
    dob: body.dob,
  });

  const contact_info_id = await contactinfo.create({
    whatsapp_no: body.whatsapp_no,
    alternate_no: body.alternate_no ? body.alternate_no : "",
    email: body.email,
    address: body.address,
  });

  const staff_info_id = await staff.create({
    basic_info_id: basic_info_id._id,
    contact_info_id: contact_info_id._id,
    joining_date: new Date(),
  });

  const admindata = await admin.create({
    username: body.username,
    password: body.password,
    staff_id: staff_info_id._id,
    is_super_admin: body.is_super_admin,
    security_pin: body.security_pin,
  });
  return admindata;
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
  const { basic_info_id, contact_info_id } = data;
  const admins = await admin.findOne({ username: userID }).populate("staff_id");

  const upateAdmin = await admin.findOneAndUpdate(
    { username: userID },
    { security_pin: data.security_pin }
  );

  const updateBasicInfo = await basicinfo.findOneAndUpdate(
    { _id: admins.staff_id.basic_info_id },
    { full_name: data.full_name, dob: data.dob }
  );

  const updateContactInfo = await contactinfo.findOneAndUpdate(
    { _id: admins.staff_id.contact_info_id },
    {
      email: data.email,
      whatsapp_no: data.whatsapp_no,
      alternate_no: data.alternate_no ? data.alternate_no : "",
      address: data.address,
    }
  );

  return updateBasicInfo;
}

async function getAdminByid(id) {
  const adminData = await admin.findOne({ id: id }).exec();

  return adminData;
}

async function getAdminByUser(u) {
  const adminData = await admin.findOne({ username: u }).populate({
    path: "staff_id",
    populate: ["basic_info_id", "contact_info_id"],
  });

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
  ChangePassowrdByUsername,
  getAdminByUsername,
  updateAdminById,
  insertadmin,
  getAdminByUser,
  getAllAdmin,
  getAdminByid,
  changeAdminByUsername,
};
