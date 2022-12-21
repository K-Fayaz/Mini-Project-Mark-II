/*
let phoneForm = document.getElementById("phone-form");
var otp;


function validateOTP(event)
{
  event.preventDefault();

  let submitOTP = document.otpform.otpvalue.value;

  if(otp == submitOTP)
  {
    alert("I love YOU!!!")
  }
  else{
    alert("You are not authorized User");
    document.getElementById("otp-validator").style.display = "none";
    otp = "";
  }

}

phoneForm.addEventListener("submit",(event)=>{
  event.preventDefault();

  let phoneNumber = document.phoneForm.phoneNumber.value;
  $.ajax({
    url:"/register/otp-validate",
    method:"POST",
    data:{
      phone: phoneNumber,
    }
  })
  .then((data)=>{
    otp = data.yourOTP;
    console.log("OTP is set");
    document.getElementById("otp-validator").style.display = "block";
    document.getElementById("otp-form").addEventListener('submit',validateOTP)
  })
  .catch((err)=>{
    console.log(err);
  })

})
*/;
// validating the form

let enable   = false;
let valName  = false;
let valPass  = false;
let valNum   = false;

let email     = document.getElementById("email");
let phone     = document.getElementById("phone");
let username  = document.getElementById("username");
let password  = document.getElementById("password");
let regForm   = document.getElementById("register-form");

let passLen  = /(?=.{8,})/;
let passUpC  = /(?=.*[A-Z])/;
let passLC   = /(?=.*[a-z])/;
let passDig  = /(?=.*[0-9])/;
let passSpc  = /(?=.*[^A-Za-z0-9])/;
let regX     = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passRegX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
/*
  password should be of atleast 8 in length
  atleast one uppercase
  atleast one lowercase
  atleast one Digit
  atleast one special charecter
*/

email.setAttribute("readonly",true);

function handleChange(event)
{
  // console.log(event.target.id);
  // console.log(event.target.value);

  document.getElementById("user").innerText = "";
  document.getElementById("invalid-email").innerText = "";
  document.getElementById("invalid-password").innerText = "";

  // validating the password
  if(event.target.id === "password")
  {
    valPass = false;
    let text;
    if(!passRegX.test(event.target.value))
    {
      if(!passLen.test(event.target.value))
      {
        text = "password should have atleast 8 charecters!"
      }
      else if(!passUpC.test(event.target.value))
      {
        text = "password should have atleast one upper case letter!";
      }
      else if(!passLC.test(event.target.value))
      {
        text = "password should have atleast one lower case letter !";
      }
      else if(!passDig.test(event.target.value))
      {
        text = "password should have atleast one digit!";
      }
      else if(!passSpc.test(event.target.value))
      {
        text = "password should have atleast one special charecter!";
      }

      document.getElementById("invalid-password").innerText = text;
      document.getElementById("invalid-password").style.display = "block";
    }else{
      valPass = true;
    }
  }

  // validating the phone Number
  if(event.target.id === "phone")
  {
    if(event.target.value.length !== 10)
    {
      valNum = false;
      document.getElementById("invalid-phone").innerText = "Phone number is not valid!";
    }else{
      valNum = true;
    }
  }

  // validatting the username
  if(event.target.id === "username")
  {
    if(event.target.value.trim().length <3 )
    {
      valName = false;
      document.getElementById("user").innerText = "Username must have atleast three letters";
    }else{
      valName = true;
    }
  }
}

email.addEventListener("input",handleChange);
username.addEventListener("input",handleChange);
password.addEventListener("input",handleChange);


regForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  console.log("I was clicked!");
  if(valName && valPass)
  {
    // get the data from form
    console.log("I am IN");

    let data = {
      username: username.value,
      email: email.value,
      password: password.value,
      key: document.getElementById("key").value,
      address: document.getElementById("address").value,
    }

    console.log(data);

      $.ajax({
        url:"/register/",
        method:"POST",
        data,
      })
      .then((data)=>{
        console.log(data);
        location.assign("/account");
      })
      .catch((err)=>{
        console.log(err);
      })

  }
})
