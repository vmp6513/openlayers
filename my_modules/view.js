import { View } from 'ol';

/*
EPSG:3857 -> Spherical Mercator, better to show, low distortion
EPSG:4326 -> WGS84
*/
const view = new View({
    center: [110.5473, 31.0216],
    zoom: 18,
    maxZoom: 18,
    projection: 'EPSG:4326'
});

view.on('change:center', (event) => {
    //Do something
})

export { view }