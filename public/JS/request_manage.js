

function manageRequest(event)
{
  let action = event.target.id.split("_");
  if(action[0] === "accept")
  {
    $.ajax({
      method:"POST",
      url:"/ride/accept/request/",
      data:{
        requestId: action[1],
        to: document.getElementById(`request-email-${action[1]}`).innerText,
        user: document.getElementById(`request-user-${action[1]}`).innerText,
      }
    })
    .then((data)=>{
      console.log(data);
      document.getElementById(`request_${action[1]}`).style.display="none";
      alert("Ride has been Scheduled");
    })
    .catch((err)=>{
      console.log(err);
      alert("there was an error!");
    })
  }

  if(action[0]=== "reject")
  {
    $.ajax({
      url:"/account/request/delete",
      method:"DELETE",
      data:{
        requestId: action[1],
        to: document.getElementById(`request-email-${action[1]}`).innerText,
        user: document.getElementById(`request-user-${action[1]}`).innerText,
      }
    })
    .then((data)=>{
      console.log(data);
      document.getElementById(`request_${action[1]}`).style.display="none";
    })
    .catch((err)=>{
      console.log(err);
      alert("there was an error");
    })
  }

}
