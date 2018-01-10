// constants

// Locations file (so it can be dynamic, not hard-coded)
const LOCATIONS_FILE = "https://raw.githubusercontent.com/SoftwareDevPro/P5_FSWD_Neighborhood_Map/master/locations.json";

// FourSquare specific constants.
const FOURSQUARE_CLIENT_ID = 'UZNGW33LOAVFAAMIDIGUVXQFV51D34JLPDBOEDYJ1YT0N0BE';
const FOURSQUARE_CLIENT_SECRET = 'ALTV4PZTPPQ0A4MDNDETGSJVHX0X1TSAYJDNICOCCEXVB5PH';
const FOURSQUARE_API_URL = 'https://api.foursquare.com/v2/venues/search?ll=';

// Map Constants

const DEFAULT_ZOOM_LEVEL = 12;

const DEFAULT_LOCATION = {
  // mistral kitchen in Seattle
  lat: 47.6161,
  lng: -122.3377
};

// Regular expression to match phone numbers.
const PHONE_REG_EX = /(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;

// the map reference
var map;

// the locations data array.
var locations = [];

// Location object, it encapsulates the location data, along
var Location = function(data) {

	// to reference the location object itself.
  var self = this;

	// create/set the location object properties (name/location,URL, etc.)

	this.name = data.name;	// name of the location.
  this.lat = data.lat;		// latitude of the location.
  this.lng = data.lng;		// longitude of the location.
  this.URL = "";					// website URL of the place (if it has one).
  this.street = "";				// street address of the location.
  this.city = "";					// city of the location.
  this.phone = "";				// phone number of the location (if it has one).

	// flag to indicate whether or no this location is visible.
  this.visible = ko.observable(true);

	// the Foursquare API call, with the query using the location name.
  const URL = FOURSQUARE_API_URL +
    this.lat + ',' +
    this.lng +
    '&client_id=' + FOURSQUARE_CLIENT_ID +
    '&client_secret=' + FOURSQUARE_CLIENT_SECRET +
    '&v=20160118' +
    '&query=' + this.name;

	function processFoursquareData(data) {

		// Grab the results from the first venue in the list.
		var results = data.response.venues[0];

		// save off the URL
		self.URL = results.url;

		// ... and if its undefined, blank it out.
		if (typeof self.URL === 'undefined') {
			self.URL = "";
		}

		// Save off the street, city, phone number.
		self.street = results.location.formattedAddress[0];
		self.city = results.location.formattedAddress[1];
		self.phone = results.contact.phone;

		if (typeof self.phone === 'undefined') {
			// blank out the phone if undefined.
			self.phone = "";

		} else {

			// format the phone number (area code/prefix/last 4)
			if (PHONE_REG_EX.test(self.phone)) {
				var parts = self.phone.match(PHONE_REG_EX);
				self.phone = (parts[1] ? parts[1] + "-" : "") +
											parts[2] + "-" + parts[3];
			}
		}
	}

	// Make the API call to Foursquare to get address information.
  $.getJSON(URL).done(function(data) {

		// Process the data received from FourSquare
		processFoursquareData(data);

  }).fail(function() {
    // alert on failure, this can happen for numerous reasons, including
    // exceeding the daily quota limit on API calls.
    alert("There was an error with the Foursquare API call.");
  });

  // the popup click button content for each location.
  this.content = "";

	// set the information window to the content string.
  this.infoWnd = new google.maps.InfoWindow({
    content: self.content
  });

	// set the Google marker using the lat/long
  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lat, data.lng),
    map: map,
    title: data.name
  });

	// the showMarker computed knockout method, sets the Marker
	// visibility based on the visible observable.
  this.showMarker = ko.computed(function() {
    if (this.visible() === true) {
			// set the marker's map to make it visible.
      this.marker.setMap(map);
    } else {
			// null out the marker, making it invisible.
      this.marker.setMap(null);
    }
    return true;
  }, this);

	// add a listener method to the marker, such that when its clicked
	// it displays the pop-up bubble with the location information.
  this.marker.addListener('click', function() {
    self.content = '<div><b>' + data.name + "</b></div>" +
                   '<div><a href="' + self.URL + '">' + self.URL + "</a></div>" +
                   '<div>' + self.street + "</div>" +
                   '<div>' + self.city + "</div>" +
                   '<div><a href="tel:' + self.phone + '">' + self.phone + "</a></div>";

		// Set the information window content HTML
    self.infoWnd.setContent(self.content);

		// show the information window on the map.
    self.infoWnd.open(map, this);

		// Set the marker animation so the user can see it.
    self.marker.setAnimation(google.maps.Animation.DROP);

		// Set a timeout, and set the animation.
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 5000);
  });

	// the drop method to invoke on drop.
  this.drop = function(place) {
    google.maps.event.trigger(self.marker, 'click');
  };
};

// the knockout App View Model
function AppViewModel() {

  // reference the current object.
  var self = this;

  // the search value knockout observable
  this.searchValue = ko.observable("");

  // the locations knockout observable array
  this.locations = ko.observableArray([]);

  // grab a reference to the DOM map element, setting the zoom and center.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: DEFAULT_ZOOM_LEVEL,
    center: DEFAULT_LOCATION
  });

	// Make the jQuery JSON call to retrieve the locations, and then
	// add them to the locations array.
	$.getJSON(LOCATIONS_FILE, function( data ) {
		$.each(data.locations, function( key, val ) {
			locations.push ( { 'name': val.name, 'lat': val.lat, 'lng': val.lng});
		});

	}).done(function() {
		// After that is done loop through the retrieved locations, and
		// create an object from them.
		locations.forEach(function(location) {
			self.locations.push(new Location(location));
		});
	});

  // the filter knockout computed observable
  this.filter = ko.computed(function() {
    // Grab the filter box search value.
    var filter = self.searchValue().toLowerCase();

    // ... and if doesn't exist...
    if (!filter) {
      // loop through and display each location (by making it visible)
      self.locations().forEach(function(location) {
        location.visible(true);
      });

      // return the updated location list.
      return self.locations();

    } else {

      // ... if the search value does exist, then create an array filter.
      return ko.utils.arrayFilter(self.locations(), function(location) {

        // grab the lowercase version of the name for comparison
        const string = location.name.toLowerCase();

        // and if it matches the filter ...
        const result = (string.search(filter) >= 0);

        // make the location visible or not depending on the filter resutl
        location.visible(result);

        // return the result.
        return result;
      });
    }
  }, self);

  // grab a reference the document map DOM element
  this.mapElem = document.getElementById('map');

} // AppViewModel

// The callback used when setting up the Google Javascript Maps API.
function initMap() {

  // Apply the bindings using the App View Model object which has the
  // declarative bindings to activate.
  ko.applyBindings(new AppViewModel());
}

// Used to handle errors when dealing with the Google Javscript Maps API.
function errorHandling() {

  // Simply alert to the failure.
  alert("Google Maps has failed to load. Please try again.");
}

//
