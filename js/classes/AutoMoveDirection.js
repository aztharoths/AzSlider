export default class AutoMoveDirection {
    static Next = new AutoMoveDirection("next");
    static Prev = new AutoMoveDirection("prev");
    constructor(direction) {
        this.direction = direction;
    }
}
