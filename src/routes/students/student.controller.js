const Student = require('../../models/student');
const BasicInfo = require('../../models/basicInfo');
const ContactInfo = require('../../models/contactInfo');
const Fees = require('../../models/fees');
const Academic = require('../../models/academic');
const Classes = require('../../models/classes');
const FeesReceipt = require('../../models/feesReceipt');
const multer = require('multer');

const imageStorage = multer.diskStorage({ 
  destination : (req, file, cb) => { cb( null , './public/images') ; }, 
  filename : (req, file, cb) => { 
    console.log(file)
    const ext = file.type.spilt("/")[1];
    cb(null , `${file.name}`) 
  }, 
})
const imageFilter = (req, file, cb) => { 
  console.log(file);
  if ( !file.type.split("/")[1] === "pdf" || file.type.split("/")[1] === "jpg" || file.type.split("/")[1] === "jpeg"){ 
      cb( new Error( 'Only jpg, jpeg or png images allowed!' ), false ) ; 
  } 
  else{
    cb(null, true) 
  }
} 
const imageUpload = multer({ 
  storage: imageStorage, 
  // fileFileter: imageFilter, 
  // limits: {fileSize: 2000000} 
}).single('studentProfile')

//-----------------------------------------------------
//---------------- STUDENT REGISTRATION ---------------
//-----------------------------------------------------
async function registerStudent(req, res, next){

  try{    
    const {class_id, photo_url="photo", full_name, mother_name, whatsapp_no, alternate_no, dob, gender, address, email, discount, reference, net_fees, note, school_name, admission_date} = req.body;
    
    if(req.files.photo){
      imageUpload(req, res, function(err){
        console.log(req.files.photo)
        if(err instanceof multer.MulterError){
          throw new Error(err.message)
          console.log(err)
        }
        else if(err){
          console.log(err)
          return res.status(200).json({
            success: false,
            message: 'Failed to upload photo'
          });
        }
      });
    }


    // START -> Checking if student already exist in same class
    const check_basic_info = await BasicInfo.findOne({
      full_name:{$regex: `^${full_name}$`, $options: 'i'}
    });

    if(check_basic_info){
      const check_student = await Student.findOne({basic_info_id: check_basic_info._id}).populate('basic_info_id');

      const check_class = await Classes.findById(class_id);

      if(check_student){
        const check_academic = await Academic.findOne({class_id: check_class._id, student_id: check_student._id},'-fees_id');

        if(check_academic){
          return res.status(200).json({
            success: false,
            message: 'Student already exists in the selected class'
          });
        }
      }
    }
    // END

    const basic_info_id = await BasicInfo.create({
      photo_url: photo_url && photo_url.trim(),
      full_name: full_name.trim(),
      gender,
      dob
    });

    const contact_info_id = await ContactInfo.create({
      whatsapp_no: whatsapp_no.trim(),
      alternate_no: alternate_no && alternate_no.trim(),
      email: email && email.trim(),
      address: address.trim()
    })

    // START -> Creating student id
    let studentId;
    await Student.find({})
    .then(docs =>{
      studentId = docs.length + 1;
    })
    .catch(error =>{
      res.status(400).json({message: error.message});
    });
    // END

    const student = await Student.create({
      student_id: studentId,
      mother_name: mother_name.trim(),
      reference,
      note,
      admission_date,
      basic_info_id: basic_info_id._id,
      contact_info_id: contact_info_id._id
    });

    const fees = await Fees.create({
      discount,
      net_fees: net_fees,
      pending_amount: net_fees
    });
    
    //START => Updating total student in class
    const class_info = await Classes.findById(class_id);
    console.log(class_info);
    await Classes.findByIdAndUpdate(
      class_id,
      {total_student: class_info.total_student + 1}
    );
    // END
  
    const academic = await Academic.create({
      class_id,
      student_id: student._id,
      fees_id: fees._id,
      school_name: school_name.trim()
    })


    res.status(201).json({ //201 = Created successfully
      success: true,
      message: 'Student registration successfull',
    });

  } catch(error){
    console.log(error)
    next(error);
  }
}

//----------------------------------------------------------------------
//-- GETTING PARTICULAR STUDENT DETAILS BY ID, FULLNAME, WHATSAPP_NO ---
//----------------------------------------------------------------------
async function getStudentDetails(req, res, next){
  try{
    let student_params = req.params.id_name_whatsapp;
    let students_detail = [];

    // Getting student basic info and contact info details
    let data = await Student.find({is_cancelled: 0}) 
    .populate({
      path:"basic_info_id",
    })
    .populate({
      path:"contact_info_id", 
    });

    data = data.filter( function (item) {
      const full_name = item.basic_info_id.full_name.toLowerCase();
      let isNameFound = false;

      if(isNaN(student_params)){
        student_params = student_params.toLowerCase();
      }

      if (full_name.indexOf(student_params) > -1){
        isNameFound = true;
      }

      return item.student_id == student_params || isNameFound || item.contact_info_id.whatsapp_no == student_params;

    });

    if(!data[0]){
      res.status(200).json({
        success: false,
        message: 'No student found'
      });
    }

    let myPromise = new Promise(function(resolve) {
      var i=0;
      data.forEach( async (item) =>{
        //getting academic details
        const academic_details = await Academic.findOne({student_id:item._id})
        .populate({
          path: "class_id",
          match: {
            is_active: 1,
          },
        });
        
        //Getting fees details
        const fees_details = await Fees.findById(academic_details.fees_id);

        students_detail.push(
          {
            "personal" : item,
            "academic" : academic_details,
            "fees" : fees_details,
          }
        )
        i++;
        if(data.length == i){
          resolve(); 
        }
      })
    });

    myPromise.then(()=>{
      res.status(200).json({
        success: true,
        data:{
          students_detail,
        }
      });
    });    

  } catch(error){
    next(error);
  }  
}

//------------------------------------------------------------------------
//------- UNIVERSAL STUDENT DETAILS BY ID, FULLNAME, WHATSAPP_NO ---------
//------------------------------------------------------------------------
async function getStudentDetailsUniversal(req, res, next){
  try{
    let student_params = req.params.id_name_whatsapp;
    let students_detail = [];

    // Getting student basic info and contact info details
    let data = await Student.find({}) 
    .populate({
      path:"basic_info_id",
    })
    .populate({
      path:"contact_info_id", 
    });

    data = data.filter( function (item) {
      const full_name = item.basic_info_id.full_name.toLowerCase();
      let isNameFound = false;

      if(isNaN(student_params)){
        student_params = student_params.toLowerCase();
      }

      if (full_name.indexOf(student_params) > -1){
        isNameFound = true;
      }

      return item.student_id == student_params || isNameFound || item.contact_info_id.whatsapp_no == student_params;

    });

    if(!data[0]){
      return res.status(200).json({
        success: false,
        message: 'No Student Found'
      });
    }

    let myPromise = new Promise(function(resolve) {
      var i=0;
      data.forEach( async (item) =>{
        //getting academic details
        const academic_details = await Academic.findOne({student_id:item._id}).populate("class_id");
        
        //Getting fees details
        const fees_details = await Fees.findById(academic_details.fees_id);

        students_detail.push(
          {
            "personal" : item,
            "academic" : academic_details,
            "fees" : fees_details,
          }
        )
        i++;
        if(data.length == i){
          resolve(); 
        }
      })
    });

    myPromise.then(()=>{
      res.status(200).json({
        success: true,
        data:{
          students_detail,
        }
      });
    });    

  } catch(error){
    next(error);
  } 
}

//----------------------------------------------------
//--------------- CANCEL STUDENT ADMINSSION ----------
//----------------------------------------------------
async function cancelStudentAdmission(req, res, next) {
  try{
    const student_details = await Student.findOneAndUpdate({student_id: req.params.student_id},{is_cancelled: 1},{returnOriginal: true});

    console.log(student_details);

    const academic_info = await Academic.findOne({student_id:student_details._id})
    .populate("fees_id", "")
    .populate({
      path: "class_id",
      match: {
        is_active: 1,
      },
    });

    //START => Updating total student in class
    const class_info = await Classes.findById(academic_info.class_id);
    await Classes.findByIdAndUpdate(
      class_info._id,
      {total_student: class_info.total_student - 1}
    );
    // END

    res.status(200).json({
      success: true,
      message:'Admission successfully cancelled', 
      data: {pending_fees: academic_info.fees_id.pending_amount}
    });

  } catch(error){
    next(error);
  }
}

//----------------------------------------------------
//---------------- UPDATE STUDENT DETAILS ------------
//----------------------------------------------------
async function updateStudentDetails(req, res, next){
  try{

     const {photo_url="photo", full_name, mother_name, whatsapp_no, alternate_no, dob, gender, address, email, discount, reference, net_fees, note, school_name} = req.body; 
     const student_id = req.params.student_id;
    
    //updating student info
    const student = await Student.findOneAndUpdate(student_id,{
      mother_name: mother_name.trim(),
      reference,
      note,
    });
    
    //updating basic info
    await BasicInfo.findByIdAndUpdate(student.basic_info_id,{
      photo_url: photo_url ? photo_url.trim() : '',
      full_name: full_name.trim(),
      gender,
      dob
    });
    
    //updating contact info
    await ContactInfo.findByIdAndUpdate(student.contact_info_id,{
      whatsapp_no: whatsapp_no.trim(),
      alternate_no: (alternate_no != '' && alternate_no != null) ? alternate_no.trim() : '',
      email: (email != '' && email != null) ? email.trim() : '',
      address: address.trim(),
    })


    //fetching academic details
    let academic = await Academic.findOneAndUpdate({student_id: student._id},{
        school_name,
      },{returnOriginal: false, new: true})
      .populate({
      path: "class_id",
      match: {
        is_active: 1,
      },
    });

    //-------------calculate pending amount--------------------
    let totalFeesPaid = 0;

    const fees_receipt = await FeesReceipt.find({fees_id:academic.fees_id}).populate("transaction_id");

    fees_receipt.forEach(function(data){
      totalFeesPaid = totalFeesPaid + data.transaction_id.amount;
    })
    //---------------------------------------------------------

    //updating fees
    const fees = await Fees.findByIdAndUpdate(academic.fees_id,{
      discount: (discount != '' && discount != null) ? discount : 0,
      net_fees,
      pending_amount: net_fees - totalFeesPaid
    });
    
    res.status(200).json({
      success: true,
      message: 'Student details successfully updated',
    });

  } catch(error){
    next(error);
  }
}


//----------------------------------------------------
//------------------- TANSFER STUDENT ----------------
//----------------------------------------------------
async function transerStudentsToNewClass(req, res, next){
  try{
    const {student_ids, class_id} = req.body;

    //START => Updating total student in class
    const class_info = await Classes.findById(class_id);
    await Classes.findByIdAndUpdate(
      class_id,
      {total_student: student_ids.length}
    );
    // END
    
    student_ids.forEach(async (student_id) =>{
      const student_info = await Student.findOne({student_id});

      const last_academic_detail = await Academic.findOne({student_id:student_info._id}).sort({date: -1}).populate("fees_id")

      const new_class_info = await Classes.findById(class_id);

      const net_fees = new_class_info.fees;

      const fees = await Fees.create({
        discount: 0,
        net_fees
      });

      const academic = await Academic.create({
        class_id: class_info._id,
        student_id: student_info._id,
        fees_id: fees._id,
        school_name: last_academic_detail.school_name
      });
    });

    res.status(200).json({
      success: true,
      message:'Students successfully transfered'
    });
    

  } catch(error){
    next(error);
  }
}

module.exports = {
  registerStudent,
  getStudentDetails,
  getStudentDetailsUniversal,
  cancelStudentAdmission,
  updateStudentDetails,
  transerStudentsToNewClass
};
