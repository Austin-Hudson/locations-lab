document.addEventListener("DOMContentLoaded", function(){
console.log("main.js loaded");

var searchBtn = document.querySelector("#search-location");

var apiPublicKeyQuery = "?key=" + API_KEY;
var map;
var longitude, latitude; //GA'S LOCATION
var currentLocation;
var userInput;
var service;
var infoWindow;

function initMap() {
  // GA's location
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



});
