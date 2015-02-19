
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete, lat, lng;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

// Prevent pressing enter on dropdown from submitting form
var input = document.getElementById('inputAddress');
google.maps.event.addDomListener(input, 'keydown', function(e) {
  if (e.keyCode == 13) {
      e.preventDefault();
  }
});

function initialize() {
  // Create the autocomplete object, restricting the search
  // to geographical location types.

  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(48.977229, -97.294658),
    new google.maps.LatLng(43.395070, -90.944824)
    );
  var input = (document.getElementById('inputAddress'));
  var options = {
    types: ['geocode'],
    componentRestrictions: {country: 'us'},
    bounds: defaultBounds
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.

  // var geolocation = new google.maps.LatLng(46.370849, -94.581870);
  // var circle = new google.maps.Circle({
  //   center: geolocation,
  //   radius: 584067
  // });
  // autocomplete.setBounds(circle.getBounds());
  // console.log('hi sina');

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    fillInAddress();
    var place1 = autocomplete.getPlace();
    document.getElementById('lat').value = place1.geometry.location.lat();
    document.getElementById('lng').value = place1.geometry.location.lng();
    lat = place1.geometry.location.lat();
    lng = place1.geometry.location.lng();
    getRepresentatives(lat, lng);
  });
}

// [START region_fillform]
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

function getRepresentatives(lat, lng) {
  $.get("http://openstates.org/api/v1/legislators/geo/?lat=" + lat + "&long=" + lng + "&apikey=0268e7d928694dfe85b778415c844a66", function(result) {
    $.each(result, function (index, value) {
      console.log(value.first_name + ' ' + value.last_name);
      console.log(value.email);
    });
  });
}