// This function retrieves the address from a place ID\
let map;
function initMap() {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ placeId: "ChIJHV5u06qwj4ARKBn77XOMPbI" }, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        console.info('%cresults: %o', 'color: red;font-size:12px', results);
        var address = results[0].formatted_address;
        console.info('%caddress: %o', 'color: red;font-size:12px', address);
      } else {
        console.log('No results found');
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });
}

// Call the getAddressFromPlaceId function with a place ID
window.initMap = initMap;
