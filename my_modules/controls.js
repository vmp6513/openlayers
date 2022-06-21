import MousePosition from 'ol/control/MousePosition';
import FullScreen from 'ol/control/FullScreen';
import { format } from 'ol/coordinate';

import Sidebar from './ol5-sidebar'

let position_control = new MousePosition({
    coordinateFormat: function (coordinate) {
        return format(coordinate, 'Longitude: {x}, Latitude: {y}', 4);
    },
    target: document.getElementById('mouse-position'),
    placeholder: false,
    projection: 'EPSG:4326'
});


let fullscreen = new FullScreen({

})

let sidebar = new Sidebar({
    element: 'sidebar',
    position: 'left'
});

document.getElementById("nav-feature-page").addEventListener("click", (evt)=>{
    sidebar.open(evt.target.getAttribute("sidebar"));
});

document.getElementById("nav-layer-page").addEventListener("click", (evt)=>{
    sidebar.open(evt.target.getAttribute("sidebar"));
});

export { position_control as mouse_position_control, fullscreen, sidebar }