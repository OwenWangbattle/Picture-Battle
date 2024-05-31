// for now, always assuming as a rectangle with possibly rotation
import SAT from './objectcrash';
class CollidableObject {
    x: number;
    y: number;
    height: number;
    width: number;
    angle: number;

    constructor(
        x: number,
        y: number,
        height: number,
        width: number,
        angle: number
    ) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.angle = angle;
    }

    collide(other: CollidableObject) {
        // to-do
        // currently do not use angle
        let sat = new SAT();
        // if (
        //     this.x <= other.x + other.width &&
        //     this.x + this.width >= other.x &&
        //     this.y <= other.y + other.height &&
        //     this.y + this.height >= other.y
        // ) {
        //     return true;
        // }
        return sat.collide(this, other);
    }
}

export default CollidableObject;
