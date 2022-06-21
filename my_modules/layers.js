import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import XYZ from "ol/source/XYZ";
import Vector from 'ol/source/Vector';
import KML from 'ol/format/KML';
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import Point from "ol/geom/Point";


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
    type: "file",
    visible: true
});

class LayerPage {
    constructor(map, target) {
        this.map = map;
        this.node = document.getElementById(target);
        this.layers = null;
        this.feature_id = 0;
        this.checkbox_dict = new Map();
        this.init();
    }
    init() {
        this.layers = this.map.getLayers();
        this.render();
    }
    render() {
        let first = this.node.firstElementChild;
        while (first) {
            first.remove();
            first = this.node.firstElementChild();
        }

        for (let i = 0; i < this.layers.getLength(); i++) {
            let cur_layer = this.layers.item(i);
            let type = cur_layer.get('type');
            let title = cur_layer.get('title');
            if(!title || type != 'base') {
                continue;
            }

            let div = document.createElement('div');
            div.classList.add("checkbox");
            div.style.fontSize = "14px";

            let label = document.createElement("label");
            label.classList.add("checkbox-inline");

            let input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.checked = true;
            input.addEventListener("change", (evt) => {
                if (evt.target.checked) {
                    cur_layer.setVisible(true);
                } else {
                    cur_layer.setVisible(false);
                }
                this.groupStateChange(evt.target);
            })

            let icon = document.createElement("icon");
            icon.classList.add("icon");
            icon.classList.add("icon-stack");

            label.appendChild(input);
            label.appendChild(document.createTextNode(title));

            div.appendChild(label);
            div.appendChild(document.createTextNode("  "));
            div.appendChild(icon);
            this.node.appendChild(div);
        }
    }
}

class FeaturePage {
    constructor(map, target) {
        this.map = map;
        this.node = document.getElementById(target);
        this.layers = null;
        this.feature_id = 0;
        this.checkbox_dict = new Map();
        this.init();
    }
    init() {
        this.layers = this.map.getLayers();
        this.render();
    }
    moveToFeature(cur_feature) {
        let geometry = cur_feature.getGeometry();
        let first_pt = [0, 0, 0];
        if (geometry instanceof MultiPolygon) {
            first_pt = geometry.getCoordinates()[0][0][0];
        } else if (geometry instanceof Point) {
            first_pt = geometry.getCoordinates();
        }
        this.map.getView().setCenter(first_pt);
    }
    groupStateChange(node) {
        //TODO: BUG!!!
        console.log(node.getAttribute("group"));
        let groups = node.getAttribute("group").split("-");
        let cur_group, prev_group;
        let length = groups.length;
        if (length <= 1) {
            cur_group = groups[length - 1];
            if (node.getAttribute("checked")) {
                this.checkbox_dict.forEach((value, key) => {
                    if (key.startsWith(cur_group)) {
                        value.checked = true;
                    }
                });
            } else {
                this.checkbox_dict.forEach((value, key) => {
                    if (key.startsWith(cur_group) && key != cur_group) {
                        value.checked = false;
                    }
                });
            }
        } else {
            cur_group = groups[length - 1];
            prev_group = groups[length - 2];
        }
        // 1. 组长开，还原组员，不用改变组员dict
        // 2. 组长关，组员关，不用改变组员dict
        // 3. 组员开，组长开，改变组员dict
        // 4. 组员关，如果所有组员关，组长关，改变组员dict
    }
    render() {
        let first = this.node.firstElementChild;
        while (first) {
            first.remove();
            first = this.node.firstElementChild();
        }

        for (let i = 0; i < this.layers.getLength(); i++) {
            let cur_layer = this.layers.item(i);
            let title = cur_layer.get('title');
            let type = cur_layer.get('type');
            if (!title || type === 'base') {
                continue;
            }

            let div = document.createElement('div');
            div.classList.add("checkbox");
            div.style.fontSize = "14px";

            let ul = document.createElement('ul');
            ul.classList.add("tree");
            //ul.classList.add("tree-angles");
            ul.classList.add("tree-lines");
            ul.setAttribute("data-ride", "tree");

            let li = document.createElement('li');

            let label = document.createElement('label');
            label.classList.add("checkbox-inline");

            let input = document.createElement('input');
            input.setAttribute("type", "checkbox");
            input.setAttribute("group", `${i}`);
            this.checkbox_dict.set(`${i}`, input);
            input.checked = true;
            input.addEventListener("change", (evt) => {
                if (evt.target.checked) {
                    cur_layer.setVisible(true);
                } else {
                    cur_layer.setVisible(false);
                }
                this.groupStateChange(evt.target);
            })

            let icon = document.createElement("icon");
            icon.classList.add("icon");
            icon.classList.add("icon-file-code");

            label.appendChild(input);
            label.appendChild(document.createTextNode(title));

            let that = this;
            // if (feature) add all feature, only support for VectorLayer
            if (cur_layer instanceof VectorLayer) {
                cur_layer.getSource().on('change', function (evt) {
                    const source = evt.target;
                    if (source.getState() === 'ready') {
                        let features = source.getFeatures();
                        let length = features.length;
                        if (length > 0) {
                            let icon = document.createElement("i");
                            icon.classList.add("list-toggle");
                            icon.classList.add("icon");
                            li.appendChild(icon);
                        }

                        let f0 = features[0];
                        // test


                        for (let j = 0; j < features.length; j++) {
                            let cur_feature = features[j];
                            let cur_geometry = cur_feature.getGeometry();
                            let name = cur_feature.get("name");

                            let ul_ = document.createElement('ul');

                            ul_.setAttribute("data-idx", "1");
                            ul_.setAttribute("feature-id", that.feature_id);
                            ul_.addEventListener('dblclick', (evt) => {
                                that.moveToFeature(cur_feature);
                            });

                            let label_ = document.createElement('label');
                            label_.classList.add("checkbox-inline");

                            let input_ = document.createElement('input');
                            input_.setAttribute("type", "checkbox");
                            input_.setAttribute("group", `${i}-${j}`);
                            that.checkbox_dict.set(`${i}-${j}`, input_);
                            input_.checked = true;
                            input_.addEventListener("change", (evt) => {
                                if (evt.target.checked) {
                                    //cur_layer.setVisible(true);
                                } else {
                                    //cur_layer.setVisible(false);
                                }
                                that.groupStateChange(evt.target);
                            })

                            let icon = document.createElement("icon");
                            icon.classList.add("icon");
                            if (cur_geometry instanceof MultiPolygon) {
                                icon.classList.add("icon-sign-blank");
                            } else if (cur_geometry instanceof Point) {
                                icon.classList.add("icon-map-marker");
                            }

                            label_.appendChild(input_);
                            label_.appendChild(document.createTextNode(name));

                            ul_.appendChild(label_);
                            ul_.appendChild(document.createTextNode("  "));
                            ul_.appendChild(icon);

                            li.appendChild(ul_);
                            that.feature_id++;
                        }
                    }
                });
            }

            li.appendChild(label);
            li.appendChild(document.createTextNode("  "));
            li.appendChild(icon);

            ul.appendChild(li)

            div.appendChild(ul);
            this.node.appendChild(div);
            this.group++;
        }

    }
}

export { kml_layer, offline_image_layer, FeaturePage, LayerPage }