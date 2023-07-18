import "./scss/styles.scss";

import EventBus from "./utils/EventBus";
window.EventBus = EventBus;
import Artwork from "./modules/Artwork";



const $wrapper = document.getElementById("webgl-container");


document.fonts.ready.then(() => {
    const artwork = new Artwork({
        $wrapper: $wrapper
    });
    window.addEventListener("resize", () => {
        artwork.resize();
    });
    
});





