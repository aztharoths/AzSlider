import Utils from "./Utils.js";

export default class AzSlide {
    constructor(content) {
        this.AzSlide = Utils.createElt("div", "AzSlider__AzSlides-container__AzSlide");
        this.AzSlide.appendChild(content);
        this.width = 0;
    }
    resize(width) {
        this.AzSlide.style.width = width + "px";
        this.width = width;
    }
}
