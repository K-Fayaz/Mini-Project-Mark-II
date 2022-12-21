window.addEventListener("load",()=>{

  const dateField  = document.getElementById("date");
  const timeField  = document.getElementById("time");
  const priceField = document.getElementById("price");
  const seatsField = document.getElementById("no-seat");
  const offerForm  = document.getElementById("offer-form");

  offerForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const fromField  = document.querySelector("#mapbox-directions-origin-input .mapboxgl-ctrl-geocoder input");
    const toField    = document.querySelector("#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input");

    console.log(fromField.value);
    console.log(toField.value);

    let data = {
      to: toField.value,
      date: dateField.value,
      time: timeField.value,
      from: fromField.value,
      seats: seatsField.value,
      price: priceField.value,
    }
    console.log(data);
    // check if all the fields are filled
    fromField.value  = "";
    toField.value = "";

    $.ajax({
      method:"POST",
      url:"/offer/ride",
      data,
    })
    .then((data)=>{
      dateField.value = "";
      timeField.value = "";
      seatsField.value = "";
      priceField.value = "";

      console.log(data.data);
      window.location.assign("/account/rides/offered/");

    })
    .catch((err)=>{
      console.log(err);
      alert("There was an error !");
    })

  })


});
