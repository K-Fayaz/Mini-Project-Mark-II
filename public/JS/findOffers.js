

function sendRequestEmail(event)
{
  let ids = event.target.id.split("_");
  console.log(ids);

  // $.ajax({
  //   method:"POST",
  //   url:`/ride/request/`,
  //   data:{
  //     to: ids[3],
  //     ride:ids[1],
  //   }
  // })
  // .then((data)=>{
  //   console.log(data);
  //   alert("Request has been recieved by user");
  // })
  // .catch((err)=>{
  //   console.log(err);
  //   alert("there was an error");
  // })

  window.location.assign(`/request/ride/${ids[1]}/`);

}

function appendData(item)
{

  // main container
  let mainContaier = document.getElementById("query-results-container");

  let resultDiv = document.createElement("div");
  resultDiv.classList.add("result");

  let userDiv = document.createElement("div");
  userDiv.classList.add("user");

  let logoDiv = document.createElement("div");
  logoDiv.classList.add("user-logo");
  logoDiv.innerText = item.driver.username[0];

  let h3_name = document.createElement("h3");
  h3_name.classList.add("user-name");
  h3_name.innerText = item.driver.username;

  userDiv.appendChild(logoDiv);
  userDiv.appendChild(h3_name);

  let fromDiv = document.createElement("div");
  fromDiv.classList.add("result-from");

  let toDiv = document.createElement("div");
  toDiv.classList.add("to-result");

  let infoDiv = document.createElement("div");
  infoDiv.classList.add("result-info");

  let toH1 = document.createElement("h1");
  let fromH1 = document.createElement("h1");

  let toSpan = document.createElement("span");
  let fromSpan = document.createElement("span");

  let atag = document.createElement("button");
  atag.setAttribute("id",`ride_${item._id}_to_${item.driver._id}`);
  console.log(atag.getAttribute("id"));
  atag.innerText = "Request for ride";
  atag.addEventListener("click",sendRequestEmail);

  fromH1.innerText = "From";
  fromSpan.innerText = `${item.from}`;

  fromDiv.appendChild(fromH1);
  fromDiv.appendChild(fromSpan);

  toH1.innerText = "to";
  toSpan.innerText = `${item.to}`;

  toDiv.appendChild(toH1);
  toDiv.appendChild(toSpan);
  console.log(item);
  // infoDiv
  let priceH3 = document.createElement("h3");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");

  span1.innerText = "price: ";
  span2.innerText = `${item.price}`;

  priceH3.appendChild(span1);
  priceH3.appendChild(span2);

  let seatsH3 = document.createElement("h3");
  let span3 = document.createElement("span");
  let span4 = document.createElement("span");

  span3.innerText = "seats: ";
  span4.innerText = `${item.seats}`;

  seatsH3.appendChild(span3);
  seatsH3.appendChild(span4);

  let timeH3 = document.createElement("h3");
  let dateH3 = document.createElement("h3");

  let timeSpan = document.createElement("span");
  let dateSpan = document.createElement("span");

  timeSpan.innerText = `Time: ${item.time}`;
  dateSpan.innerText = `Date: ${item.date}`;

  timeH3.appendChild(timeSpan);
  dateH3.appendChild(dateSpan);

  infoDiv.appendChild(priceH3);
  infoDiv.appendChild(seatsH3);
  infoDiv.appendChild(timeH3);
  infoDiv.appendChild(dateH3);

  resultDiv.appendChild(userDiv);
  resultDiv.appendChild(fromDiv);
  resultDiv.appendChild(toDiv);
  resultDiv.appendChild(infoDiv);
  resultDiv.appendChild(atag);

  mainContaier.appendChild(resultDiv);

}

window.addEventListener("load",()=>{
  const findOfferBtn = document.getElementById("find-offers-btn");

  const fromField  = document.querySelector("#mapbox-directions-origin-input .mapboxgl-ctrl-geocoder input");
  const toField    = document.querySelector("#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input");

  findOfferBtn.addEventListener("click",()=>{
    if(fromField.value && toField.value)
    {
        // find routes in given range
        const data = {
          from: fromField.value,
          to: toField.value,
        };

        // console.log(data);

        $.ajax({
          method:"POST",
          url:"/request/ride",
          data,
        })
        .then((data)=>{
          let items = data;
          for(let item of items)
          {
            appendData(item);
          }
        })
        .catch((err)=>{
          console.log(err);
        })

    }else{
      alert("Choose source and destination first");
    }
  })

});


/*
<div class="result">
  <div class="result-from">
    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
    </svg> -->

    <h1>From</h1>
    <span>Karatgi, Gangawati, Koppal, Karnataka, India</span>
  </div>
  <div class="to-result">
    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg> -->
    <h1>To: </h1>
    <span>Gangawati, Karnataka, India</span>
  </div>
  <div class="result-info">
    <h3>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
      </svg> -->
      <span>Price</span>
      <span>150</span>
    </h3>
    <h3>
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg> -->
      <span>available seats: </span>
      <span>2</span>
    </h3>
  </div>
  <a href="#">view on Map</a>
</div>

*/
