import 'ol/ol.css';
import './style.css';
import './css/ol5-sidebar.css';

import { offline_image_layer, kml_layer, FeaturePage, LayerPage} from './my_modules/layers';
import { view } from './my_modules/view';
import { fullscreen, sidebar } from './my_modules/controls';
import { Interaction } from './my_modules/interaction';
import LandslideRecog from './my_modules/landslide_recog';

import { DragRotateAndZoom, defaults as defaultInterations } from 'ol/interaction';
import { Map } from 'ol';

// import { connection } from './my_modules/mysql_connection';

// CORE: map object
const map = new Map({
  target: 'map',
  layers: [offline_image_layer, kml_layer],
  view: view,
  interactions: defaultInterations().extend([new DragRotateAndZoom()]),
  controls: []
});

map.on('click', (event) => {
  //console.log(event.coordinate);
});

// add controls
map.addControl(fullscreen);
map.addControl(sidebar);
// add interaction
const interaction = new Interaction(map);
// add slide-recog
const landslide_recog = new LandslideRecog(map, 'landslide-quick-recog', 'landslide-area-recog');
// add layer-page
const feature_page = new FeaturePage(map, "feature-content");
const layer_page = new LayerPage(map, "layer-content");