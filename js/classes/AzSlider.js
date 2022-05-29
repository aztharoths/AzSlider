import Utils from "./Utils.js";
import AzSlide from "./AzSlide.js";

export default class AzSlider {
    /**
     *
     * @param {Element} slidesContainer The Element who's contain originals slides
     */
    constructor(slideContainer) {
        //-------------------- SAVE SLIDES --------------------//

        this.slidesContainer = slideContainer;
        this.savedSlides = this.#saveSlides();

        //-------------------- /SAVE SLIDES --------------------//

        //-------------------- CREATE AZSLIDER --------------------//

        [this.AzSlider, this.AzSlidesContainer] = this.#createAzSlider();

        //-------------------- /CREATE AZSLIDER --------------------//

        //-------------------- CREATE AZSLIDES --------------------//

        this.AzSlidesCount = 0;
        this.AzSlides = [];
        this.#createAzSlides();

        //-------------------- /CREATE AZSLIDES --------------------//
    }

    #saveSlides() {
        const savedSlides = [];
        for (let i = 0; i < this.slidesContainer.children.length; i++) {
            const savedNode = this.slidesContainer.children[i].cloneNode(true);
            savedSlides.push(savedNode);
        }
        return savedSlides;
    }

    #createAzSlider() {
        const AzSlider = Utils.createElt("section", "AzSlider");
        const AzSlidesContainer = Utils.createElt("div", "AzSlider__AzSlides-container");
        AzSlider.appendChild(AzSlidesContainer);
        this.slidesContainer.innerHTML = "";
        this.slidesContainer.appendChild(AzSlider);
        return [AzSlider, AzSlidesContainer];
    }
    #addAzSlide(slide) {
        const newAzSlide = new AzSlide(slide);
        this.AzSlides.push(newAzSlide);
        this.AzSlidesContainer.appendChild(newAzSlide.AzSlide);
        this.AzSlidesCount++;
    }

    #createAzSlides() {
        for (let i = 0; i < this.savedSlides.length; i++) {
            this.#addAzSlide(this.savedSlides[i]);
        }
    }
}
