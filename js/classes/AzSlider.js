import Utils from "./Utils.js";
import AzSlide from "./AzSlide.js";
import AutoMoveDirection from "./AutoMoveDirection.js";

const defaultOptions = {
    AzSlidesToShow: 3,
    AzSlidesToMove: 3,
    navigation: false,
    prevButtonInnerHTML: "<",
    nextButtonInnerHTML: ">",
    transitionDuration: 300,
    transitionTimingFunction: "linear",
    infiniteLoop: false,
    autoMove: false,
    autoMoveDelay: 5000,
    mouseStopAutoMove: true,
    pagination: false,
    scroller: true,
    scrollerSpeed: 10,
    scrollerPixelsToMove: 1,
    mouseStopScroller: true,
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
     * @param {Boolean} options.infiniteLoop
     * @param {Boolean} options.autoMove
     * @param {Number} options.autoMoveDelay in ms
     * @param {Boolean} options.mouseStopAutoMove
     * @param {Boolean} options.pagination
     * @param {Boolean} options.scroller
     * @param {Number} options.scrollerSpeed in ms
     * @param {Number} options.scrollerPixelsToMove in pixels
     * @param {Boolean} options.mouseStopScroller
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

        if (this.options.navigation && !this.options.scroller) {
            [this.prevButton, this.nextButton, this.buttonIsActive] = this.#createNavigation();
        }

        //-------------------- /CREATE NAVIGATION --------------------//

        //-------------------- INIT VARIABLES --------------------//

        [this.AzSliderWidth, this.AzSlideWidth] = this.#initAzSliderSize();
        this.position = this.#initPosition();

        //-------------------- /INIT VARIABLES --------------------//

        //-------------------- AUTOMOVE --------------------//

        if (this.options.autoMove && !this.options.scroller) {
            this.autoMoveDirection = AutoMoveDirection.Next;
            this.autoMoveIntervalPaused = false;
            this.autoMoveInterval = this.#autoMove();
            if (this.options.mouseStopAutoMove) {
                this.AzSlider.addEventListener("mouseenter", (e) => {
                    this.autoMoveIntervalPaused = true;
                });
                this.AzSlider.addEventListener("mouseleave", (e) => {
                    this.autoMoveIntervalPaused = false;
                });
            }
        }

        //-------------------- /AUTOMOVE --------------------//

        //-------------------- PAGINATION --------------------//

        if (this.options.pagination && !this.options.scroller) {
            this.page = 1;
            this.paginationCells = this.#createPagination();
            this.#updatePagination();
        }

        //-------------------- /PAGINATION --------------------//

        //-------------------- SCROLLER --------------------//

        if (this.options.scroller) {
            this.scrollerPosition = 0;
            this.scrollerIntervalPaused = false;
            this.scrollerInterval = this.#createScrollerInterval();
            if (this.options.mouseStopScroller) {
                this.AzSlider.addEventListener("mouseenter", (e) => {
                    this.scrollerIntervalPaused = true;
                });
                this.AzSlider.addEventListener("mouseleave", (e) => {
                    this.scrollerIntervalPaused = false;
                });
            }
        }

        //-------------------- /SCROLLER --------------------//
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
        const AzSlidesContainer = Utils.createElt(
            "div",
            "AzSlider__AzSlides-container",
            this.options.scroller || {
                style:
                    "transition: transform " +
                    this.options.transitionDuration +
                    "ms " +
                    this.options.transitionTimingFunction +
                    " 0ms",
            }
        );
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

    #duplicatePrevAzSlides() {
        for (let i = 0; i < this.options.AzSlidesToShow; i++) {
            const duplicateSlide =
                this.savedSlides[
                    this.savedSlides.length - this.options.AzSlidesToShow + i
                ].cloneNode(true);
            this.#addAzSlide(duplicateSlide);
        }
    }
    #duplicateNextAzSlides() {
        for (let i = 0; i < this.options.AzSlidesToShow; i++) {
            const duplicateSlide = this.savedSlides[i].cloneNode(true);
            this.#addAzSlide(duplicateSlide);
        }
    }

    #createAzSlides() {
        if (this.options.infiniteLoop && !this.options.scroller) this.#duplicatePrevAzSlides();

        for (let i = 0; i < this.savedSlides.length; i++) {
            this.#addAzSlide(this.savedSlides[i]);
        }

        if (this.options.infiniteLoop || this.options.scroller) this.#duplicateNextAzSlides();
    }

    //-------------------- /CREATE AZSLIDES --------------------//

    //-------------------- CREATE NAVIGATION --------------------//
    #pauseTransition() {
        this.buttonIsActive = false;
        this.AzSlidesContainer.removeAttribute("style");
        this.AzSlidesContainer.style.width = this.AzSliderWidth + "px";
        setTimeout(() => {
            this.buttonIsActive = true;
            this.AzSlidesContainer.style.transition =
                "transform " +
                this.options.transitionDuration +
                "ms " +
                this.options.transitionTimingFunction +
                " 0ms";
        }, 50);
    }

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

        if (!this.options.infiniteLoop) this.#manageButtons(position);

        //-------------------- /MANAGE BUTTONS --------------------//

        //-------------------- MANAGE POSITION --------------------//

        if (
            this.options.infiniteLoop &&
            position > this.AzSlidesCount - this.options.AzSlidesToShow - 1
        ) {
            setTimeout(() => {
                this.#pauseTransition();
                position = this.options.AzSlidesToShow;
                this.#moveTo(position);
            }, this.options.transitionDuration);
        }

        //-------------------- /MANAGE POSITION --------------------//

        //-------------------- MANAGE PAGINATION --------------------//

        if (this.options.pagination) this.#nextPage();

        //-------------------- /MANAGE PAGINATION --------------------//
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

        if (!this.options.infiniteLoop) this.#manageButtons(position);

        //-------------------- /MANAGE BUTTONS --------------------//

        //-------------------- MANAGE POSITION --------------------//

        if (this.options.infiniteLoop && position <= 0) {
            setTimeout(() => {
                this.#pauseTransition();
                position = this.AzSlidesCount - this.options.AzSlidesToShow * 2;
                this.#moveTo(position);
            }, this.options.transitionDuration);
        }

        //-------------------- /MANAGE POSITION --------------------//

        //-------------------- MANAGE PAGINATION --------------------//

        if (this.options.pagination) this.#prevPage();

        //-------------------- /MANAGE PAGINATION --------------------//
    }

    #prevButtonFunction() {
        this.#moveBackward();
        if (this.options.autoMove) {
            this.autoMoveDirection = AutoMoveDirection.Prev;
            clearInterval(this.autoMoveInterval);
            setTimeout(() => {
                this.autoMoveInterval = this.#autoMove();
            }, this.options.transitionDuration);
        }
    }
    #nextButtonFunction() {
        this.#moveForward();
        if (this.options.autoMove) {
            this.autoMoveDirection = AutoMoveDirection.Next;
            clearInterval(this.autoMoveInterval);
            setTimeout(() => {
                this.autoMoveInterval = this.#autoMove();
            }, this.options.transitionDuration);
        }
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
        if (!this.options.infiniteLoop) this.#hiddeButton(prevButton);

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

    //-------------------- AUTOMOVE --------------------//

    #autoMove() {
        const autoMoveInterval = setInterval(() => {
            if (this.autoMoveIntervalPaused) {
                return;
            }
            switch (this.autoMoveDirection) {
                case AutoMoveDirection.Next:
                    this.#moveForward();
                    break;
                case AutoMoveDirection.Prev:
                    this.#moveBackward();
                    break;
                default:
                    break;
            }
            if (
                !this.options.infiniteLoop &&
                this.position > this.AzSlidesCount - this.options.AzSlidesToShow - 1
            ) {
                this.autoMoveDirection = AutoMoveDirection.Prev;
            }
            if (!this.options.infiniteLoop && this.position <= 0)
                this.autoMoveDirection = AutoMoveDirection.Next;
        }, this.options.autoMoveDelay);
        return autoMoveInterval;
    }
    //-------------------- /AUTOMOVE --------------------//

    //-------------------- PAGINATION --------------------//

    #createPagination() {
        const pagination = Utils.createElt("div", "AzSlider__pagination");
        this.AzSlider.appendChild(pagination);
        let firstPage = 1;
        const pages =
            firstPage +
            (this.savedSlides.length - this.options.AzSlidesToShow) / this.options.AzSlidesToMove;
        const paginationCells = [];
        for (let i = 0; i < pages; i++) {
            const paginationCell = Utils.createElt("div", "AzSlider__pagination__cell");
            pagination.appendChild(paginationCell);
            paginationCells.push(paginationCell);
        }
        return paginationCells;
    }
    #nextPage() {
        let actualPage = this.page;
        actualPage++;
        if (actualPage > this.paginationCells.length) {
            actualPage = 1;
        }
        this.page = actualPage;
        this.#updatePagination();
    }
    #prevPage() {
        let actualPage = this.page;
        actualPage--;
        if (actualPage < 1) {
            actualPage = this.paginationCells.length;
        }
        this.page = actualPage;
        this.#updatePagination();
    }
    #updatePagination() {
        for (let i = 0; i < this.paginationCells.length; i++) {
            if (i === this.page - 1) {
                this.paginationCells[i].classList.add("AzSlider__pagination__cell--active");
            } else {
                this.paginationCells[i].classList.remove("AzSlider__pagination__cell--active");
            }
        }
    }

    //-------------------- /PAGINATION --------------------//

    //-------------------- SCROLLER --------------------//

    #createScrollerInterval() {
        const scrollerInterval = setInterval(() => {
            if (this.scrollerIntervalPaused) {
                return;
            }
            let actualScrollerPosition = this.scrollerPosition;
            actualScrollerPosition += this.options.scrollerPixelsToMove;
            if (
                actualScrollerPosition >=
                this.AzSliderWidth - this.AzSlideWidth * this.options.AzSlidesToShow
            ) {
                actualScrollerPosition = 0;
            }
            this.AzSlidesContainer.style.transform =
                "translateX(-" + actualScrollerPosition + "px )";
            this.scrollerPosition = actualScrollerPosition;
        }, this.options.scrollerSpeed);
        return scrollerInterval;
    }
    //-------------------- /SCROLLER --------------------//
}
