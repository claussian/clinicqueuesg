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

  // retrieve GeoJSON from mongodb using AJAX
  $.ajax({
    method: 'GET',
    url: '/load'
  })
  .done(function(data) {
    // Create a <script> tag which executes a callback function
    var script = document.createElement('script');
    script.innerHTML = 'eqfeed_callback({"type":"FeatureCollection","features":' + JSON.stringify(data) + '});'
    // append to document head to load the script
    // console.log(script);
    document.getElementsByTagName('head')[0].appendChild(script);

    // Render features by passing callback function to map.data.setStyle
    // map.data.setStyle(function(feature) {
    //       var queue = parseInt(feature.getProperty('queue'));
    //       console.log(queue);
    //       return {
    //         icon: getCircle(queue)
    //       };
    //     });
      });
  }

  function getCircle(queue) {
    // console.log(queue);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: 0.5,
      scale: queue/5,
      //scale: Math.pow(2, queue) / 2,
      strokeColor: 'white',
      strokeWeight: .5
    };
  }

// 'results' is a placeholder; eqfeed_callback() is executed when geoJSON script loads upon completion of AJAX call
function eqfeed_callback(results) {
    // map.data.addGeoJson(results);
    // console.log(results);
    for (var i = 0; i < results.features.length; i++) {
          var coords = results.features[i].geometry.coordinates;
          var latLng = new google.maps.LatLng(coords[1],coords[0]);
          var queue = parseInt(results.features[i].properties.queue);
          var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon: getCircle(queue)
            });
        };
}


function initFeatures() {

}


/* Initialise document for JQuery */
$(document).ready(function() {
  console.log('document loaded');
  // initMap();

  /* init FeatureCollection */

});
