import MousePosition from 'ol/control/MousePosition';
import FullScreen from 'ol/control/FullScreen';
import { format } from 'ol/coordinate';

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
/* ------------------- */

export { position_control as mouse_position_control , fullscreen}