import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import olMapScreenshot from 'ol-map-screenshot';
import Draw, { createBox } from 'ol/interaction/Draw';

const HOST = 'http://172.16.124.227:8080/';
const IMG_SIZE = [500, 500];

export default class LandslideRecog {
    constructor(map, quick_recog_node, area_recog_node) {
        this.map = map;

        this.source = new VectorSource();
        this.layer = new VectorLayer({
            source: this.source
        })
        this.map.addLayer(this.layer);

        this.quick_element = document.getElementById(quick_recog_node);
        this.quick_element.onclick = () => {
            this.sendRequest(HOST + 'quick_recog_api', this.quickRecog, this.failure);
        }
        this.area_element = document.getElementById(area_recog_node);
        this.area_element.onclick = () => {
            this.selectRecogArea();
            //this.sendRequest(HOST + 'area_recog_api', this.areaRecog, this.failure);
        }
    }
    selectRecogArea() {
        let draw = new Draw({
            type: 'Circle',
            source: this.source,
            geometryFunction: createBox(),
        })
        draw.on('drawend', (event) => {
            let feature = event.feature;
            let coors = feature.getGeometry().getCoordinates();
            this.generateImages(coors);
            this.map.removeInteraction(draw);
        });
        this.map.addInteraction(draw);
    }

    generateImages(coors) {
        let view = this.map.getView();
        view.setZoom(18);
        let lt_pt = coors[0][3];
        let rb_pt = coors[0][1];
        this.map.renderSync();
        let lt_pt_pixel = this.map.getPixelFromCoordinate(lt_pt);
        let rb_pt_pixel = this.map.getPixelFromCoordinate(rb_pt);
        console.log(lt_pt_pixel);
        console.log(rb_pt_pixel);
    }

    async sendRequest(url, success, failure) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                success(request.responseText);
            } else if (request.readyState === 4) {
                failure(request.status);
            }
        }
        let data = await olMapScreenshot.getScreenshot(this.map, {
            showDisplayScale: false,
        });
        request.open('POST', url);
        request.send(JSON.stringify(data));
    }
    failure(status) {
        console.log('Something wrong!' + status);
    }
    quickRecog(response) {
        console.log('OK!' + response);
    }
    areaRecog(response) {
        console.log('OK!' + response);
    }

    displayOnScreen(json) {
        let new_features = new Array();
        if (typeof json === 'str' || typeof json === 'string') {
            json = JSON.parse(json);
        }
        json = json.content;
        for (let i = 0; i < json.length; i++) {
            let item = json[i];
            for (let j = 0; j < item.points[0].length; j++) {
                item.points[0][j] = this.map.getCoordinateFromPixel(item.points[0][j]);
            }
            let feature = new Feature({
                geometry: new Polygon(item.points, 'XY'),
                name: item.name,
                type: item.type,
                id: item.id
            })
            new_features.push(feature);
        }
        this.source.addFeatures(new_features);
    }
}