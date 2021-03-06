document.addEventListener("DOMContentLoaded", function(){
console.log("main.js loaded");

var searchBtn = document.querySelector("#search-location");
var showAllBtn = document.querySelector("#show-all-btn");
var deleteBtn = document.querySelector("#delete-btn");
var deleteValueBtn = document.querySelector("#delete-value-btn");
var updateBtn = document.querySelector("#update-btn");
var updateValueBtn = document.querySelector("#comment-value-btn");

var map;
var longitude, latitude;
var currentLocation;
var userInput;
var service;
var infoWindow;

function initMap() {
  currentLocation =  new google.maps.LatLng(latitude,longitude);
  map = new google.maps.Map(document.getElementById('map'), {
    center: currentLocation,
    zoom: 15
  });
  var request = {
    location: currentLocation,
    radius: '30',
    query: userInput
  }

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function success(pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
  initMap();
}
function error(){
  var results = document.querySelector(".results");
  var p = document.createElement("p");
  p.innerHTML = "An error has occured.";
  results.appendChild(p);
}

function showAllPlaces(places){
  var div = document.querySelector(".show-all");
  div.innerHTML = "";
  for(var i = 0; i < places.length; i++){
    var divPlace = document.createElement("div");
    divPlace.classList.add("place");
    var p = document.createElement("p");
    p.innerHTML = "Name: " + places[i].name + " " + "Address: " + places[i].address;
    if(places[i].comment){
      p.innerHTML += " Comment: " + places[i].comment;
    }
    divPlace.appendChild(p);
    div.appendChild(divPlace);

  }
}


function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
function createMarker(res) {
    var marker = new google.maps.Marker({
      position: res.geometry.location,
      map: map
    })
    infoWindow = new google.maps.InfoWindow({
        content: ""
    });
    google.maps.event.addListener(marker, "click", function(){
      infoWindow.setContent(res.name + "<button type='button' id='fav'>Fav it!</button");
      infoWindow.open(map, this);

      document.querySelector("#fav").addEventListener("click", function(){
        var location = {
          name: res.name,
          address: res.formatted_address
        }
        console.log(location);
        $.post('http://localhost:3000/locations', location, function(response){
          console.log("Response:", response);
        })
      })

    });

  }
searchBtn.addEventListener("click", function(){
  navigator.geolocation.getCurrentPosition(success,error);
  userInput = document.querySelector("#location-text").value;
});

showAllBtn.addEventListener("click", function(){
  var results = document.querySelector(".results");
  results.innerHTML = "";
  $.get('http://localhost:3000/locations', function(response){
      showAllPlaces(response);
    });
})

deleteBtn.addEventListener("click", function(){
  var results = document.querySelector(".results");
  results.innerHTML = "";
  var deleteDiv = document.querySelector(".delete");
  deleteDiv.style.display = "block";
  var updateDiv = document.querySelector(".update");
  updateDiv.style.display = "none";
})

deleteValueBtn.addEventListener("click", function(){
  var deleteValue = document.querySelector("#delete-value").value;
  $.ajax({
      url: 'http://localhost:3000/locations/' + deleteValue,
      type: 'DELETE',
      success: 'http://localhost:3000/locations/',
      error: error
    }).done(function(data){
      var results = document.querySelector(".results");
      var p = document.createElement("p");
      p.style.color = "red";
      p.innerHTML = "Place has been deleted";
      results.appendChild(p);
    });

  $
})

updateBtn.addEventListener("click", function(){
  var results = document.querySelector(".results");
  results.innerHTML = "";
  var updateDiv = document.querySelector(".update");
  updateDiv.style.display = "block";
  var deleteDiv = document.querySelector(".delete");
  deleteDiv.style.display = "none";
})

updateValueBtn.addEventListener("click", function(){
  var updateNameValue = document.querySelector("#update-name").value;
  var updateComment = document.querySelector("#comment-value").value;

  var data = {
        name: updateNameValue,
        comment: updateComment
      }
  $.ajax({
       url: 'http://localhost:3000/locations/'  + updateNameValue,
       dataType: 'json',
       method: 'put',
       data: data
     }).done(function(response){
       var results = document.querySelector(".results");
       var p = document.createElement("p");
       p.style.color = "red";
       p.innerHTML = "Place has been updated";
       results.appendChild(p);
       results.style.display = "flex";
     });
})
});
