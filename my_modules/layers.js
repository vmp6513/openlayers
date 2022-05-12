import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import Vector from 'ol/source/Vector';
import KML from 'ol/format/KML';


const offline_image_layer = new TileLayer({
    source: new XYZ({
        url: "satellite/googlemaps/satellite_en/{z}/{x}/{y}.jpg"
    }),
    title: "Google Earth离线瓦片",
    type: "base",
    visible: true
});

const kml_layer = new VectorLayer({
    source: new Vector({
        url: "kml/zigui.kml",
        format: new KML({
            extractStyles: true
        })
    }),
    title: "秭归县KML文件",
    visible: true
});


export { kml_layer, offline_image_layer}