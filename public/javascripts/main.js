var geocoder;
var map;

/*****************************/
/* Check whether to load Map */
/*****************************/
function mapExists() {
  return $('#map').length > 0 ? true : false;
}

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

  function dateFormatter(date) {
    var datetime = date;
    var time = datetime.toTimeString().split(' ')[0];
    var date = datetime.toDateString().split(' ');
    var dateformatted = time + ' ' + date[0] + ' ' + date[1] + ' ' + date[2];
    return dateformatted;
  }

  function getCircle(queue) {
    // console.log(queue);
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: 0.5,
      scale: Math.sqrt(queue)*2,
      //scale: Math.pow(2, queue) / 2,
      strokeColor: 'white',
      strokeWeight: .5
    };
  }

/* 'results' is a data placeholder; eqfeed_callback() is executed when geoJSON object loads upon completion of AJAX */
function eqfeed_callback(results) {
    // map.data.addGeoJson(results);
    // console.log(results);

    /* Instantiate single instance of infowindow */
    var infowindow = new google.maps.InfoWindow();

    /* Function to place marker and open infowindow */
    function placeMarker(coords, queue, infopanel) {
      var latLng = new google.maps.LatLng(coords[1], coords[0]);
      var marker = new google.maps.Marker({
        position : latLng,
        map: map,
        icon: getCircle(queue)
      });
      google.maps.event.addListener(marker, 'mouseover', function(){
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(infopanel);
        infowindow.open(map, marker);
      });
    }
    /* Attach infowindows */
    var infowindow = new google.maps.InfoWindow();
    for (var i = 0; i < results.features.length; i++) {
          var coords = results.features[i].geometry.coordinates;
          var queue = parseInt(results.features[i].properties.queue);
          var newDateTime = dateFormatter(new Date(results.features[i].properties.time_created));

          // Add panel content on hover
          var infopanel = $('#infopanel').html();
          infopanel = infopanel.replace('{{clinicname}}', results.features[i].properties.name_full);
          infopanel = infopanel.replace('{{queue}}',queue).replace('{{waittime}}',results.features[i].properties.waitTime);
          infopanel = infopanel.replace('{{time_created}}',newDateTime);
          // /* Point a new reference to new infopanel */
          // var clone = JSON.parse(JSON.stringify(infopanel));
          // iw.push(clone);
          placeMarker(coords, queue, infopanel);
        };

}

/* GET private clinic names */
function initTypeAheadPrivateClinics() {
  $.ajax({
    method: 'GET',
    url: '/loadPrivateNames'
  }).done(function (data) {
    var newdata = [];
    data.forEach(function(item, index){
      newdata.push(item.properties.Name);
    });
    $.typeahead({
      input: ".js-typeahead",
      order: "asc",
      source: newdata
    });
  });
}
 /* reverse geocode a clinic coordinate */
function codeAddress() {
    var clinicname = $('#query-clinic').val();
    // console.log(address);
    $.ajax({
      method:'GET',
      url: '/loadPrivate'
    }).done(function (data) {
      var clinic = data.filter(function(elem){
        return elem.properties.Name == clinicname;
      });
      console.log(clinic[0].geometry.coordinates);
      var coord = clinic[0].geometry.coordinates;
      var latlng = {lat: parseFloat(coord[1]), lng: parseFloat(coord[0])};

      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            map.setZoom(15);
            /* pin drop */
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              icon: '../images/chas-transparent-small.png'
            });
            /* center map to new clinic location */
            var newll = new google.maps.LatLng(latlng);
            map.panTo(newll);
            /* add content to chaspanel */
            var chaspanel = $('#chaspanel').html();
            chaspanel = chaspanel.replace('{{clinicname}}',clinicname).replace('{{address}}',results[1].formatted_address);
            chaspanel = chaspanel.replace('{{datetime}}', dateFormatter(new Date()));
            /* add infowindow */
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(chaspanel);
            infowindow.open(map, marker);
          } else {
            window.alert('No results found');
          }
        }
        else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
    // geocoder = new google.maps.Geocoder();
    // geocoder.geocode( { 'address': address}, function(results, status) {
    //   if (status == 'OK') {
    //     map.setCenter(results[0].geometry.location);
    //     var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location
    //     });
    //   } else {
    //     alert('Geocode was not successful for the following reason: ' + status);
    //   }
    //});
  }

  /**
 * Upload the photos using ajax request.
 *
 * @param formData
 */
 function uploadImage(formData) {
    $.ajax({
        url: '/report',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
    }).fail(function (status) {
        alert(status);
    });
  }

/* Initialise document for JQuery */
$(document).ready(function() {
  console.log('document loaded');
  if(mapExists()) {
    initMap();
  }
  /* Set up typeahead */
  initTypeAheadPrivateClinics();

  /* Set up event listeners */

  /* Password match validator */
  $('#inputPassword-signup-val').on('keyup', function(event) {
    if($(event.target).val() == $('#inputPassword-signup').val()) {
      $('#password-validate').removeClass('has-error');
      $('#password-validate').addClass('has-success');
    }
    else {
      $('#password-validate').removeClass('has-error');
      $('#password-validate').addClass('has-error');
    }
  });
  /* Clear stylings on cancel */
  $('#cancel-btn').on('click', function(event) {
    $('#password-validate').removeClass('has-error');
    $('#password-validate').removeClass('has-success');
  });

  /* Submit new user */
  $('#submit-signup').on('click', function(event) {
    var email = $('#inputEmail-signup').val();
    var password = $('inputPassword-signup-val').val();
    var userData = {
      email: email,
      password: password
    };
    $.ajax({
      method: 'POST',
      url: '/signup',
      data: userData
    }).done(function(data){
      console.log('done');
    });
  });

  /*******************/
  /* FORM SUBMISSION */
  /*******************/

  /* Select a file and update field*/
  $('#photo-input').on('change', function(event) {
    var input = $(event.target).get(0).files[0].name;
    //console.log(input);
    var label = input.replace(/\\/g, '/').replace(/.*\//, '');
    $('.file-display').val(label);
  });

  /* Reverse-geocode the added clinics */
  $('#query-button').on('click', function(event) {
    codeAddress();
  });

  /* Attach event listener to form submit */
  $('#submit-photo').submit( function (event) {
    // event.stopPropagation();
    event.preventDefault();
    // var formData = new FormData($(this)[0]);
    // console.log(formData);
    // Get the files from input, create new FormData.
    var filesdat = $('#photo-input').get(0).files,
    formData = new FormData();

    //console.log(filesdat);

    if (filesdat.length === 0) {
        alert('Select a photo to upload.');
        return false;
    }
    else if (filesdat.length > 1) {
        alert('You can only upload 1 photo. Please clear the form');
        return false;
    }
    else {
      formData.append('properties.name', $('#query-clinic').val());
      formData.append('queueImg', filesdat[0], filesdat[0].name);
      // uploadFiles(formData);
      console.log(formData);
    }


});



});
