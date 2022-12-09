class Food {
    element: HTMLElement;
    constructor() {
        this.element = document.getElementById("food")!;
    }
    get X() {
        return this.element.offsetLeft;
    }
    get Y() {
        return this.element.offsetTop;
    }

    change() {
        this.element.style.left = 10 * Math.round(Math.random() * 29) + "px";
        this.element.style.top = 10 * Math.round(Math.random() * 29) + "px";
    }
}

export default Food;