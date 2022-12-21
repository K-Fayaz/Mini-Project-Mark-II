mapboxgl.accessToken = 'pk.eyJ1IjoieWFkdTc4NmZheWF6IiwiYSI6ImNsYjFhYWczcDE3czEzd28zamt0bnJpODAifQ.Ghao5O-Yjt4fs4l2UkHKUw';

const map = new mapboxgl.Map({
  container: 'googleMap',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [75.1240,15.3647], // starting position
  zoom: 12,
});

var directions = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
});

map.addControl(directions,"top-left");

let nav = new mapboxgl.NavigationControl();
map.addControl(nav);


// handle form submit
