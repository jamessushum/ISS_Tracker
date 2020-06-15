// Initialize Leaflet map and set view settings according to geo coordinates and zoom level
const myMap = L.map('issMap').setView([0, 0], 1);

// Openstreetmap required attribution per copyright notice
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// TileURL is a template that tells Leaflet how to load tiles from openstreetmap given the style, zoom, and geo coordinates
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// TileLayer is how Leaflet loads and displays tile layers on the map
const tiles = L.tileLayer(tileURL, { attribution });

// Adds tiles to myMap
tiles.addTo(myMap);

// Creates Leaflet marker icon given specific image, attaches to marker method as a second argument
const issIcon = L.icon({
  iconUrl: '../images/iss.png',
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});

// Marker is a Leaflet method that displays clickable/draggable icons on the map based on geo coordinates
const marker = L.marker([0, 0], {icon: issIcon}).addTo(myMap);

// Variable storing ISS API URL
const apiURL = 'https://api.wheretheiss.at/v1/satellites/25544';

// Async function fetching the ISS API data
async function getISS() {
  const response = await fetch(apiURL);
  const data = await response.json();
  // JS destructuring grabs the lat, lon and altitude parameters in the data object and creates variables storing the specific data
  const { latitude, longitude, altitude, velocity } = data;

  // SetLatLng is a marker method that changes the marker position to the given geo coordinates
  marker.setLatLng([latitude, longitude]);

  // SetView method sets where the focus and zoom level will be when the map is first loaded, getZoom method is used to center the ISS icon and move the map when geo coordinates change
  myMap.setView([latitude, longitude], myMap.getZoom());

  // Converts kilometers to miles
  const altitudeMiles = altitude * 0.62137119;
  const velocityMiles = velocity *  0.62137119;

  // Access the DOM HTML elements for lat, lon, alt and velocity to display
  document.getElementById('lat').textContent = latitude.toFixed(2);
  document.getElementById('lon').textContent = longitude.toFixed(2);
  document.getElementById('alt').textContent = altitudeMiles.toFixed(2);
  document.getElementById('vel').textContent = velocityMiles.toFixed(2);
}

// Invoking the getISS async function
getISS();

// Method that repeatedly calls a function with a fixed time delay between each call, getISS is called every 1 second
setInterval(getISS, 1000);