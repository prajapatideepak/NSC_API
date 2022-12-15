const Classes = require("../../models/classes");
const Academic = require("../../models/academic");
const Student = require("../../models/student");
const Fees = require("../../models/fees");
const BasicInfo = require("../../models/basicinfo");
const Exceljs = require("Exceljs");
const student = require("../../models/student");

//---------------------------------------//
//----------Create new classes-----------//
//---------------------------------------//
exports.createNewClass = async (req, res, next) => {
  try {
    const {
      batch_start_year,
      batch_end_year,
      class_name,
      total_student,
      fees,
      is_primary,
      stream,
      medium,
      is_active,
      createdAt,
    } = req.body;

    const classes = await Classes.create({
      batch_start_year,
      batch_end_year,
      class_name,
      total_student,
      fees,
      is_primary,
      stream,
      medium,
      is_active,
      createdAt,
    });

    res.status(201).json({
      success: true,
      data: classes,
      message: "Created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//------------------------------------//
//----------Get All classes-----------//
//------------------------------------//
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Classes.find({ is_active: { $ne: -1 } })

    if (!classes[0]) {
      return res.status(200).json({
        success: false,
        message: "Classes not found"
      })
    }

    res.status(200).json({
      success: true,
      data: classes,
      message: "Display successfully"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

//------------------------------------//
//----------Get All classes By Year-----------//
//------------------------------------//
exports.getAllClassesByYear = async (req, res) => {
  try {
    const classes = await Classes.aggregate([
      { $match: { is_active: { $ne: -1 } } },
      { $group: { _id: { batch_start_year: '$batch_start_year', batch_end_year: '$batch_end_year' } } }, { $sort: { batch_start_year: -1 } },
    ])

    if (!classes[0]) {
      return res.status(200).json({
        success: false,
        message: "Classes not found"
      })
    }

    res.status(200).json({
      success: true,
      data: classes,
      message: "Display successfully"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

//------------------------------------//
//----------Display classes-----------//
//------------------------------------//
exports.displayClass = async (req, res, next) => {
  try {
    const classes = await Classes.find({
      is_active: 1,
    });

    if (!classes[0]) {
      throw new Error("Classes not found");
    }

    res.status(200).json({
      success: true,
      data: classes,
      message: "Display successfully",
    });
  } catch (error) {
    // res.status(400).json({
    //     success:false,
    //     message:error.message
    // })
  }
};

//-----------------------------------//
//----------Update classes-----------//
//-----------------------------------//
exports.updateClass = async (req, res, next) => {
  try {
    let classes = await Classes.findById(req.params.id);

    if (!classes) {
      return res.status(200).json({
        success: false,
        message: "Classes not found",
      });
    }

    classes = await Classes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      data: classes,
      message: "Update successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//-----------------------------------//
//----------Delete classes-----------//
//-----------------------------------//
exports.deleteClass = async (req, res, next) => {
  try {
    let classes = await Classes.findById(req.params.id);

    if (!classes) {
      return res.status(200).json({
        success: false,
        message: "Classes not found",
      });
    }

    let updateValue = { $set: { is_active: -1 } };
    classes = await Classes.findByIdAndUpdate(req.params.id, updateValue, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    const classID = await Classes.findById(req.params.id);
    const academicID = await Academic.find({ class_id: classID })
      .populate("student_id")
      .populate("fees_id");

    academicID.forEach(async (element) => {
      await Student.findByIdAndUpdate(
        element.student_id._id,
        { is_cancelled: 1 },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    });

    res.status(200).json({
      success: true,
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//---------------------------------------------------------------------------------//
//----------Display classes by medium,is_primary,stream,batch_start_year-----------//
//---------------------------------------------------------------------------------//
exports.classSearch = async (req, res, next) => {
  try {
    const { year, is_primary } = req.query;

    const classes = await Classes.find({
      $and: [{ is_primary: is_primary }, { batch_start_year: year }],
    });

    if (!classes[0]) {
      return res.status(200).json({
        success: false,
        message: "Classes not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classes,
      message: "Display successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//-------------------------------------//
// ----------Transfer Classes----------//
//-------------------------------------//
exports.transferClasses = async (req, res, next) => {
  try {
    const classes_details = req.body;

    //Deactivating all the previous active classes
    await Classes.updateMany({ is_active: 1 }, { $set: { is_active: 0 } });

    //Creating new classes
    classes_details.forEach(async (element) => {
      await Classes.create({
        batch_start_year: element.batch_start_year + 1,
        batch_end_year: element.batch_end_year + 1,
        class_name: element.class_name,
        total_student: 0,
        fees: element.fees,
        is_primary: element.is_primary,
        stream: element.stream,
        medium: element.medium,
        is_active: 1
      });
    });

    res.status(200).json({
      success: true,
      data: classes_details,
      message: "Transfer classes successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//-------------------------------------------------//
//----------Display All Student In class-----------//
//-------------------------------------------------//
exports.displayStudentInClass = async (req, res, next) => {
  try {
    const classID = await Classes.findById(req.params.id);
    const academicID = await Academic.find({ class_id: classID })
      .populate({
        path: "student_id",
        populate: ["basic_info_id", "contact_info_id"],
      })
      .populate("fees_id");

    if (!academicID[0]) {
      return res.status(200).json({
        success: false,
        message: "Students not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        studentDetails: academicID,
        classDetails: classID
      },
      message: "Display successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


//---------------------------------------------------------//
//----------Export to Excel All Student In class-----------//
//---------------------------------------------------------//
exports.exportStudentInClass = async (req, res, next) => {
  try {
    const classID = await Classes.findById(req.params.id);
    const academicID = await Academic.find({ class_id: classID })
      .populate({
        path: "student_id",
        populate: ["basic_info_id", "contact_info_id"],
      })
      .populate("fees_id")
      .populate("class_id");

    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Student");
    worksheet.columns = [
      { header: "Student ID", key: "Student ID", width: "10" },
      { header: "Class_Name", key: "Class_Name", width: "10" },
      { header: "Name", key: "Name", width: "10" },
      { header: "Gender", key: "Gender", width: "10" },
      { header: "Phone", key: "Phone", width: "10" },
      { header: "Total Fee", key: "Total Fee", width: "10" },
      { header: "Paidup", key: "Paidup", width: "10" },
      { header: "Pending", key: "Pending", width: "10" },
    ];

    let count = 1;
    let className = ""
    academicID.forEach(student => {
      (student).student_id = count;
      className = student.class_id.class_name
      const Student_details = student
      worksheet.addRow({
        "Student ID": Student_details.student_id.student_id,
        "Class_Name": className,
        "Name" : Student_details.student_id.basic_info_id.full_name,
        "Gender" : Student_details.student_id.basic_info_id.gender,
        "Phone" : Student_details.student_id.contact_info_id.whatsapp_no,
        "Total Fee" : Student_details.fees_id.net_fees,
        "Paidup" : Student_details.fees_id.net_fees - Student_details.fees_id.pending_amount,
        "Pending" : Student_details.fees_id.pending_amount,
      })
      count += 1;
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })
    const homeDir = require('os').homedir(); // See: https://www.npmjs.com/package/os
    const desktopDir = `${homeDir}/Downloads`;

    const data = await workbook.xlsx.writeFile(`${desktopDir}/Class_${className}.xlsx`)
  

    return res.status(200).json({
      success: true,
      message: "Data Export",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


//---------------------------------------------------------//
//----------Export to Excel All Student In class-----------//
//---------------------------------------------------------//
exports.exportPendingStudentInClass = async (req, res, next) => {
  try {
    const classID = await Classes.findById(req.params.id);
    const academicID = await Academic.find({ class_id: classID })
      .populate({
        path: "student_id",
        populate: ["basic_info_id", "contact_info_id"],
      })
      .populate("fees_id")
      .populate("class_id");

    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Student");
    worksheet.columns = [
      { header: "Student ID", key: "Student ID", width: "10" },
      { header: "Class_Name", key: "Class_Name", width: "10" },
      { header: "Name", key: "Name", width: "10" },
      { header: "Gender", key: "Gender", width: "10" },
      { header: "Phone", key: "Phone", width: "10" },
      { header: "Total Fee", key: "Total Fee", width: "10" },
      { header: "Pending", key: "Pending", width: "10" },
    ];

    let count = 1;
    let className = ""
    academicID.forEach(student => {
      (student).student_id = count;
      className = student.class_id.class_name
      const Student_details = student
      worksheet.addRow({
        "Student ID": Student_details.student_id.student_id,
        "Class_Name": className,
        "Name" : Student_details.student_id.basic_info_id.full_name,
        "Gender" : Student_details.student_id.basic_info_id.gender,
        "Phone" : Student_details.student_id.contact_info_id.whatsapp_no,
        "Total Fee" : Student_details.fees_id.net_fees,
        "Pending" : Student_details.fees_id.pending_amount,
      })
      count += 1;
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })
    const homeDir = require('os').homedir(); // See: https://www.npmjs.com/package/os
    const desktopDir = `${homeDir}/Downloads`;

    const data = await workbook.xlsx.writeFile(`${desktopDir}/Class_${className}_Pending_Fee.xlsx`)  

    return res.status(200).json({
      success: true,
      message: "Data Export",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//------------------------------------------------------//
//----------Student Search By ID, Name, Mobile----------//
//------------------------------------------------------//
exports.studentSearchById_Name_Mobile = async (req, res, next) => {
  try {
    let student_params = req.params.id_name_whatsapp;
    let student_details;
    let academic_details;
    let fees_details;

    // Getting student basic info and contact info details
    let data = await Student.find({ is_cancelled: 0 })
      .populate({
        path: "basic_info_id",
      })
      .populate({
        path: "contact_info_id",
      });

    data = data.filter(function (item) {
      const full_name = item.basic_info_id.full_name.toLowerCase();
      let isNameFound = false;

      if (isNaN(student_params)) {
        student_params = student_params.toLowerCase();
      }

      if (full_name.indexOf(student_params) > -1) {
        isNameFound = true;
      }

      return (
        item.student_id == student_params ||
        isNameFound ||
        item.contact_info_id.whatsapp_no == student_params
      );
    });

    if (!data[0]) {
      return res.status(200).json({
        success: false,
        message: "No student found",
      });
    }

    student_details = data;
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
