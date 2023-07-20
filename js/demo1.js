import "./demo1/scss/styles.scss";

import Artwork from "./demo1/modules/Artwork";
const $wrapper = document.getElementById("webgl-container");

document.fonts.ready.then(() => {
    const artwork = new Artwork({
        $wrapper: $wrapper
    });
    window.addEventListener("resize", () => {
        artwork.resize();
    });
    
});





