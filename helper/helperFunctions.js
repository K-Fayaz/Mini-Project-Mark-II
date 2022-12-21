const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email,html)=>{
  const msg = {
     to: email,
     from: 'kfayaz1407@gmail.com',
     subject: 'Verify Your Email',
     html: `${html}`
   }

  try{
    let res = await sendgrid.send(msg);
    return res;
  }
  catch(err){
    return Error(err);
  }
}

module.exports = {
  sendEmail,
}
