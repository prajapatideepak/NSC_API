const nodemailer = require("nodemailer");

const Email = (options) => {
  let transpoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    auth: {
      user: process.env.USER, // email
      pass: process.env.PASSWORD, //password
    },
  });
  transpoter.sendMail(options, (err, info) => {
    if (err) {
      return;
    }
  });
};
// send email
const FeesSender = ({ email, full_name, amount, date, admin }) => {
  const options = {
    from: `Nasir Sir Classes 👨‍🏫 <${process.env.USER}>`,
    to: `${email}`,
    subject: "Thank you for your payment",
    html: `
        <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
        <div style="max-width: 700px; background-color: white; margin: 0 auto">
           <div style="width: 100%; background-color: #ADD8E6; padding: 20px 0">
          <a href="${process.env.CLIENT_URL}" ><img
              src="https://res.cloudinary.com/doagkfdns/image/upload/v1666102288/Nasir/logo_vhv2gr.png"
              style="width: 100%; height: 70px; object-fit: contain"
            /></a> 
          
          </div>
          <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
            <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
                    Payment SuccessFull
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
            <h2> Hello , ${full_name} </h2>
            <p>Thank you for your tuition fees. We're glad to have you as a student at Nasir sir classes. We hope that this will be a great experience for you.</p>
            <p>Amount Recived ${amount} by ${admin}</p>
            <p>date : ${date} </p>
             <p style="font-weight:800">Thanks you   </p>
              <p style="font-weight:800" >Team Nasir</b></p>
            </div>
          </div>
        </div>
      </div>
        `,
  };
  Email(options);
};
module.exports = FeesSender;
