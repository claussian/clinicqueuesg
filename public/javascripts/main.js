var geocoder;
var map;

/************************************************/
/* Initialise map at SG central water catchment */
/************************************************/

function initMap() {
  console.log("initmap init");
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(1.356077, 103.820761); //central water catchment
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function initFeatures() {
  $.ajax({
    method: 'GET',
    url: '/load'
  })
  .done(function(data) {
    console.log(data); // render points here
  });
}




/* Initialise document for JQuery */
$(document).ready(function() {
  console.log('document loaded');
  initMap();
  initFeatures();

  /* init FeatureCollection */

});
