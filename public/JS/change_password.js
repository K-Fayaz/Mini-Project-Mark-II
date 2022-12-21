let newPasswordField = document.getElementById("password-1");
let confirmPassFeild = document.getElementById("password-2");
let visibilityOne    = document.getElementById("visibility-1");
let visibilityTwo    = document.getElementById("visibility-2");
let button           = document.getElementById("chage-pass-btn");
let changePassForm   = document.getElementById("chage-pass-form"); 

let fieldOne = false;
let fieldTwo = false;

let passLen  = /(?=.{8,})/;
let passUpC  = /(?=.*[A-Z])/;
let passLC   = /(?=.*[a-z])/;
let passDig  = /(?=.*[0-9])/;
let passSpc  = /(?=.*[^A-Za-z0-9])/;
let passRegX = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;


function enable()
{
    button.disabled = false;
    button.style.background = '#FFDF00';
    button.style.cursor = "pointer";
}

function disabled()
{
    button.disabled = true;
    button.style.cursor = "not-allowed";
    button.style.background = "#fbff025a";
}

disabled();

function handleVisibility()
{
    let id = this.id.split("-");
    let el = document.getElementById(`password-${id[1]}`);
    console.log(el.getAttribute("type"));
    if(el.getAttribute("type") == "text")
    {
        el.setAttribute("type","password");
        this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        </svg>
        `;
    }else{
        el.setAttribute("type","text");
        this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
      </svg>
        `;
    }
}

visibilityOne.addEventListener("click",handleVisibility);
visibilityTwo.addEventListener("click",handleVisibility);

changePassForm.addEventListener("submit",(event)=>{

    event.preventDefault();

    if(newPasswordField.value === confirmPassFeild.value)
    {
        $.ajax({
            method:"POST",
            url:"/password/change/verified/",
            data:{
                password: newPasswordField.value,
            }
        })
        .then((data)=>{
            console.log(data.data);
            window.location.assign("/account");
        })
        .catch((err)=>{
            console.log(err);
            alert("something went wrong!");
        })
        
    }else{
        document.getElementById("form-err").innerText = "passwords do not match!";
    }


})

function handleInput(event)
{   
    let id = event.target.id.split("-");
    console.log(id[1])

    let el = document.getElementById(`password-${id[1]}`);
    let text;

    if(!passRegX.test(el.value))
    {
        if(!passLen.test(el.value))
        {
            text = "password should have atleast 8 charecters!"
        }
        else if(!passUpC.test(el.value))
        {
            text = "password should have atleast one upper case letter!";
        }
        else if(!passLC.test(el.value))
        {
            text = "password should have atleast one lower case letter !";
        }
        else if(!passDig.test(el.value))
        {
            text = "password should have atleast one digit!";
        }
        else if(!passSpc.test(el.value))
        {
            text = "password should have atleast one special charecter!";
        }


        if(event.target.id === "password-1")
        {
            fieldOne = false;
        }
        if(event.target.id === "password-2"){
            fieldTwo = false;
        }
    }else{
        text = "";

        if(event.target.id === "password-1")
        {
            fieldOne = true;
        }
        if(event.target.id === "password-2"){
            fieldTwo = true;
        }
    }

    document.getElementById(`password-${id[1]}-text`).innerText =  text;

    console.log(fieldOne);
    console.log(fieldTwo);
    console.log(fieldOne && fieldTwo);

    if(fieldOne && fieldTwo)
    {
        enable();
    }else{
        disabled();
    }

}

newPasswordField.addEventListener("input",handleInput);
confirmPassFeild.addEventListener("input",handleInput);