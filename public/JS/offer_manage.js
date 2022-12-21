


function manageOffers(event)
{
  let targetId = event.target.id.split("-");
  if(!targetId)
  {
    alert("This page is not loaded yet!");
  }else{
    console.log(targetId);
    console.log(targetId[1]);
    $.ajax({
      method:"DELETE",
      url:"/account/rides/offered/",
      data:{
        id: targetId[1],
      }
    })
    .then((data)=>{
      document.getElementById(`offer-container-${targetId[1]}`).style.display = "none";
      // alert("The offer has been deleted Successfully !");
      console.log(data);
    })
    .catch((err)=>{
      console.log(err);
    })
  }
}
