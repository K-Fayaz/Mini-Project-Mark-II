let verEmail  = document.getElementById("email-verify");
let verifyBtn = document.getElementById("email-verify--btn");
let validForm = document.getElementById("validate-email-form");

verifyBtn.style.display = "none";

let regX     = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


function handleChange(event)
{

  document.getElementById("valid-email-verify").style.display = "none";

  if(event.target.id === "email-verify")
  {
    regX.test(event.target.value) ? valdEmail = true : valEmail = false;

    if(!regX.test(event.target.value))
    {
      /*if(!verifyBtn.getAttribute("disabled"))
      {
        verifyBtn.setAttribute("disabled",true);
      }*/
      verifyBtn.style.display = "none";
      document.getElementById("email-verify--btn").classList.add("disable");
      document.getElementById("invalid-email-verify").innerText = "Email is invalid!";
    }else{
      document.getElementById("invalid-email-verify").innerText = "";
      console.log("I am valid");
      document.getElementById("email-verify--btn").classList.remove("disable");
      /*if(verifyBtn.getAttribute("disabled"))
      {
        verifyBtn.setAttribute("disabled",false);
      }*/
      verifyBtn.style.display = "block";
      console.log(verifyBtn.getAttribute("disabled"));
    }
  }
}

verEmail.addEventListener("input",handleChange);

validForm.addEventListener("submit",(event)=>{
  event.preventDefault();

  let data = {
    email: verEmail.value
  }

  $.ajax({
    method: "POST",
    url:"/validate-email",
    data
  })
  .then((data)=>{
    console.log(data);
    verifyBtn.style.display = "none";
    verEmail.value = "";
    document.getElementById("valid-email-verify").style.display = "block";
  })
  .catch((err)=>{
    console.log(err);
  });
});
