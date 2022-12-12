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
const EmailSender = ({ email, full_name }) => {
  const options = {
    from: `Nasir Sir Classes 👨‍🏫 <${process.env.USER}>`,
    to: `${email}`,
    subject: "Thank you for adminision",
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
              Form Nasir Sir Classes
            </p>
            <div style="font-size: .8rem; margin: 0 30px">
            <h2> Hello , ${full_name} </h2>
            <p>Welcome to Nasir Classes! We’re excited for the opportunity to help you succeed in your studies.</p>
            <p>We want students like you to be able to reach their full potential. To support this goal, we have an effective and flexible teaching staff who are ready with individualized attention.</p>
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
module.exports = EmailSender;
