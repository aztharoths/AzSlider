export default class Utils {
    /**
     * Create and retun an element with classes and attributes declared in args
     * @param {string} eltName Element's name.
     * @param {(string|string[])} classesName The class name of the element or an array of all classes name of the element
     * @param {Object} [attributes] An object where each pair of key/value meaning setAttibute(key,value)
     * @returns {Element} Element created
     */
    static createElt(eltName, classesName, attributes) {
        //CREATE ELEMENT
        const elt = document.createElement(eltName);
        //ADD CLASS(ES)
        if (classesName) {
            if (typeof classesName === "string") {
                elt.setAttribute("class", classesName);
            } else if (Array.isArray(classesName)) {
                classesName.forEach((className) => {
                    elt.classList.add(className);
                });
            }
        }
        //SET ATTRIBUTE(S)
        if (attributes && typeof attributes === "object") {
            for (const [key, value] of Object.entries(attributes)) {
                elt.setAttribute(key, value);
            }
        }
        return elt;
    }
}
