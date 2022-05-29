import Utils from "./Utils.js";
import AzSlide from "./AzSlide.js";

const defaultOptions = {
    AzSlidesToShow: 3,
    AzSlidesToMove: 3,
    navigation: true,
    prevButtonInnerHTML: "<",
    nextButtonInnerHTML: ">",
    transitionDuration: 300,
    transitionTimingFunction: "linear",
};

export default class AzSlider {
    /**
     *
     * @param {Element} slidesContainer The Element who's contain originals slides
     * @param {Object} options
     * @param {Number} options.AzSlidesToShow
     * @param {Number} options.AzSlidesToMove
     * @param {Boolean} options.navigation is navigation enable
     * @param {String} options.prevButtonInnerHTML
     * @param {String} options.nextButtonInnerHTML
     * @param {Number} options.transitionDuration in ms
     * @param {String} options.transitionTimingFunction
     */
    constructor(slideContainer, options) {
        //-------------------- OPTIONS --------------------//

        this.options = Object.assign(defaultOptions, options);

        //-------------------- /OPTIONS --------------------//

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

        //-------------------- CREATE NAVIGATION --------------------//

        if (this.options.navigation) {
            [this.prevButton, this.nextButton, this.buttonIsActive] = this.#createNavigation();
        }

        //-------------------- /CREATE NAVIGATION --------------------//

        //-------------------- INIT VARIABLES --------------------//

        [this.AzSliderWidth, this.AzSlideWidth] = this.#initAzSliderSize();
        this.position = this.#initPosition();

        //-------------------- /INIT VARIABLES --------------------//
    }

    //-------------------- SAVE SLIDES --------------------//

    #saveSlides() {
        const savedSlides = [];
        for (let i = 0; i < this.slidesContainer.children.length; i++) {
            const savedNode = this.slidesContainer.children[i].cloneNode(true);
            savedSlides.push(savedNode);
        }
        return savedSlides;
    }

    //-------------------- /SAVE SLIDES --------------------//

    //-------------------- CREATE AZSLIDER --------------------//

    #createAzSlider() {
        const AzSlider = Utils.createElt("section", "AzSlider");
        const AzSlidesContainer = Utils.createElt("div", "AzSlider__AzSlides-container", {
            style:
                "transition: transform " +
                this.options.transitionDuration +
                "ms " +
                this.options.transitionTimingFunction +
                " 0ms",
        });
        AzSlider.appendChild(AzSlidesContainer);
        this.slidesContainer.innerHTML = "";
        this.slidesContainer.appendChild(AzSlider);
        return [AzSlider, AzSlidesContainer];
    }

    //-------------------- /CREATE AZSLIDER --------------------//

    //-------------------- CREATE AZSLIDES --------------------//

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

    //-------------------- /CREATE AZSLIDES --------------------//

    //-------------------- CREATE NAVIGATION --------------------//
    #moveTo(position) {
        this.AzSlidesContainer.style.transform =
            "translateX(-" + position * this.AzSlideWidth + "px)";
        this.position = position;
    }

    #moveForward() {
        //-------------------- IS BUTTON ACTIVE --------------------//

        if (!this.buttonIsActive) {
            return;
        }

        //-------------------- /IS BUTTON ACTIVE --------------------//

        //-------------------- DISABLE BUTTON --------------------//

        this.buttonIsActive = false;
        setTimeout(() => {
            this.buttonIsActive = true;
        }, this.options.transitionDuration);

        //-------------------- /DISABLE BUTTON --------------------//

        //-------------------- UPDATE POSITION --------------------//

        let position = this.position;
        position += this.options.AzSlidesToMove;
        this.#moveTo(position);

        //-------------------- /UPDATE POSITION --------------------//

        //-------------------- MANAGE BUTTONS --------------------//

        this.#manageButtons(position);

        //-------------------- /MANAGE BUTTONS --------------------//
    }
    #moveBackward() {
        //-------------------- IS BUTTON ACTIVE --------------------//

        if (!this.buttonIsActive) {
            return;
        }

        //-------------------- /IS BUTTON ACTIVE --------------------//

        //-------------------- DISABLE BUTTON --------------------//

        this.buttonIsActive = false;
        setTimeout(() => {
            this.buttonIsActive = true;
        }, this.options.transitionDuration);

        //-------------------- /DISABLE BUTTON --------------------//

        //-------------------- UPDATE POSITION --------------------//

        let position = this.position;
        position -= this.options.AzSlidesToMove;
        this.#moveTo(position);

        //-------------------- /UPDATE POSITION --------------------//

        //-------------------- MANAGE BUTTONS --------------------//

        this.#manageButtons(position);

        //-------------------- /MANAGE BUTTONS --------------------//
    }

    #prevButtonFunction() {
        this.#moveBackward();
    }
    #nextButtonFunction() {
        this.#moveForward();
    }

    #hiddeButton(button) {
        button.classList.add("AzSlider__navButton-container__button--hidden");
    }
    #showButton(button) {
        button.classList.remove("AzSlider__navButton-container__button--hidden");
    }

    #manageButtons(position) {
        if (position > 0) {
            this.#showButton(this.prevButton);
        }
        if (position <= 0) {
            this.#hiddeButton(this.prevButton);
        }
        if (position < this.AzSlidesCount - this.options.AzSlidesToShow) {
            this.#showButton(this.nextButton);
        }
        if (position >= this.AzSlidesCount - this.options.AzSlidesToShow) {
            this.#hiddeButton(this.nextButton);
        }
    }

    #createNavigation() {
        let buttonIsActive = true;

        //-------------------- PREV BUTTON --------------------//

        const prevButtonContainer = Utils.createElt("div", [
            "AzSlider__navButton-container",
            "AzSlider__navButton-container--prev",
        ]);
        this.AzSlider.appendChild(prevButtonContainer);
        const prevButton = Utils.createElt("button", "AzSlider__navButton-container__button");
        prevButtonContainer.appendChild(prevButton);
        prevButton.innerHTML = this.options.prevButtonInnerHTML;
        prevButton.addEventListener("click", (e) => {
            this.#prevButtonFunction();
        });
        this.#hiddeButton(prevButton);

        //-------------------- /PREV BUTTON --------------------//

        //-------------------- NEXT BUTTON --------------------//

        const nextButtonContainer = Utils.createElt("div", [
            "AzSlider__navButton-container",
            "AzSlider__navButton-container--next",
        ]);
        this.AzSlider.appendChild(nextButtonContainer);
        const nextButton = Utils.createElt("button", "AzSlider__navButton-container__button");
        nextButtonContainer.appendChild(nextButton);
        nextButton.innerHTML = this.options.nextButtonInnerHTML;
        nextButton.addEventListener("click", (e) => {
            this.#nextButtonFunction();
        });

        //-------------------- /NEXT BUTTON --------------------//

        return [prevButton, nextButton, buttonIsActive];
    }
    //-------------------- /CREATE NAVIGATION --------------------//

    //-------------------- INIT VARIABLES --------------------//

    #initAzSliderSize() {
        const AzSlideWidth = window.innerWidth / this.options.AzSlidesToShow;
        const AzSlidesContainerWidth = AzSlideWidth * this.AzSlidesCount;
        this.AzSlidesContainer.style.width = AzSlidesContainerWidth + "px";
        this.AzSlides.forEach((AzSlide) => {
            AzSlide.resize(AzSlideWidth);
        });
        return [AzSlidesContainerWidth, AzSlideWidth];
    }
    #initPosition() {
        let position = 0;
        if (this.options.infiniteLoop) {
            position = this.options.AzSlidesToShow;
        }
        this.#moveTo(position);
        return position;
    }

    //-------------------- /INIT VARIABLES --------------------//
}
