import Select from 'ol/interaction/Select';


class Interaction {
    constructor(map) {
        this.map = map;
        this.select = new Select();

        this.addSelect();
        // this.addScreenshot();
    }
    addSelect() {
        this.map.addInteraction(this.select);
        // select event
        this.select.on('select', (event) => {
            //console.log(event.target);
        })
    }
}


export { Interaction }