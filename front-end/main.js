document.addEventListener("DOMContentLoaded", function(){
console.log("main.js loaded");

var locationBtn = document.querySelector("#location-btn");
var searchBtn = document.querySelector("#search-location");


var apiPublicKeyQuery = "?key=" + API_KEY;
var map;
var longitude = -73.9895971, latitude = 40.7399767; //GA'S LOCATION


function initMap() {
  // GA's location
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(latitude,longitude),
    zoom: 15
  });


}


searchBtn.addEventListener("click", function(){
  var userInput = document.querySelector("#location-text").value;
  console.log(userInput);

});
locationBtn.addEventListener("click", function(){
  //get location
  initMap();

});

});
