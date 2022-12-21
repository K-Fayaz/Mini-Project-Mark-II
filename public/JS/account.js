let edited = false;
let valid  = true;
let regX   = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



let email            = document.getElementById("email");
let username         = document.getElementById("username");
let editBtn          = document.getElementById("edit-btn");
let editForm         = document.getElementById("edit-form");
let addPhoneInput    = document.getElementById("phone-add");
let changePassBtn    = document.getElementById("change-pass");
let editables        = document.querySelectorAll(".editable");
let phoenAddForm     = document.getElementById("phone-add-form");
let saveBtn          = document.getElementById("save-change-btn");
let removeBtn        = document.getElementById("remove-phone-add-box-svg");
let phoneFormCont    = document.getElementById("phone-add-form-container");

//  to remove the form button


document.getElementById("phone-add-form-btn").style.display = "none";

for(let input of editables)
{
  input.addEventListener("change",()=>{
    edited = true;
    console.log(edited);
  });
}

function handleChange(event)
{
  if(event.target.id == "phone-add")
  {
    if(event.target.value.length !== 10)
    {
      document.getElementById("phone-add-err-mess").style.display = "block";
      document.getElementById("phone-add-form-btn").style.display = "none";
    }else{
      document.getElementById("phone-add-form-btn").style.display = "block";
      document.getElementById("phone-add-err-mess").style.display = "none";
    }
  }
}


removeBtn.addEventListener("click",(event)=>{
  phoneFormCont.style.display = "none";
})

editForm.addEventListener("submit",(event)=>{
  event.preventDefault();
  let text;
  if(!edited)
  {
    editBtn.style.display = "block";
    saveBtn.style.display = "none";

    for(let i = 0; i < document.querySelectorAll(".editable").length; i++)
    {
      document.querySelectorAll(".editable")[i].setAttribute("readonly",true);
    }

  }else{

    let name = username.value;
    console.log(name);
    let mail = email.value;
    console.log(mail);
    console.log(regX.test(mail));

    if(name.length < 3)
    {
      valid = false;
      document.getElementById("username-message").style.display = "block";
      document.getElementById("username-message").innerText = "username must have atleast three letters";
      text = "username must have atleast three letters";
    }else if(!regX.test(mail))
    {
      valid = false;
      document.getElementById("email-message").style.display = "block";
      document.getElementById("email-message").innerText = "Email is not valid!";
      text = "Email is not valid";
    }else{

      let data = {
        username:name,
        email: mail,
      }

      // send it to server
      $.ajax({
        method:"POST",
        url:"/edit",
        data
      })
      .then((data)=>{
        email.value = data.email;
        username.value = data.username;
        saveBtn.style.display = "none";
        editBtn.style.display = "block";
      })
      .catch((err)=>{
        console.log(err);
      })

      for(let i = 0; i < document.querySelectorAll(".editable").length; i++)
      {
        document.querySelectorAll(".editable")[i].setAttribute("readonly",true);
      }

    }
  }
})

// saveBtn.style.display = "none";

addPhoneInput.addEventListener("input",handleChange);

editBtn.addEventListener("click",()=>{
  saveBtn.style.display = "block";
  editBtn.style.display = "none";
  for(let i = 0; i < document.querySelectorAll(".editable").length; i++)
  {
    document.querySelectorAll(".editable")[i].removeAttribute("readonly");
  }
});

window.addEventListener("scroll",()=>{
  // console.log(window.scrollY);
  document.querySelector(".dashboard").style.top = `0`;
  document.querySelector(".dashboard").style.height = `100vh`;
});

phoenAddForm.addEventListener("submit",(event)=>{
  event.preventDefault();

  $.ajax({
    method:"POST",
    url:"/user/add/phone",
    data:{
      phone:addPhoneInput.value,
    }
  })
  .then((data)=>{
    console.log(data);
    window.location.reload();
  })
  .catch((err)=>{
    console.log(err);
  })
});

let addPhone      = document.getElementById("add-phone-btn");

addPhone.addEventListener("click",(event)=>{
  event.preventDefault();
  phoneFormCont.style.display = "grid";
});


changePassBtn.addEventListener("click",(event)=>{
  $.ajax({
    method:"POST",
    url:"/account/password/change/request",
  })
  .then((data)=>{
    console.log("Password change link has been send to your email!");
    alert("Password change link has been sent to your email!")
  })
  .catch((err)=>{
    console.log("something went wrong !");
  })
});


window.addEventListener("load",()=>{
  $.ajax({
    method:"GET",
    url:"/get/user/balance",
  })
  .then((data)=>{
    console.log(data);
    document.getElementById("eth-bal").innerText = `${data} ETH`;
  })
  .catch((err)=>{
    console.log(err);
  })
})
