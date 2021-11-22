import { Subject } from 'rxjs';
import { Circle } from 'detect-collisions';
import { Lifecycle } from '.';
export class CircleBody extends Circle {
    constructor(gameObject, radius) {
        super(gameObject, radius);
        this.name = 'CircleBody';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
        if (!radius) {
            throw new Error("CircleBody radius can't be 0!");
        }
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    get x() {
        return this.pos.x;
    }
    set x(x) {
        ;
        this.pos.x = x;
    }
    get y() {
        return this.pos.y;
    }
    set y(y) {
        ;
        this.pos.y = y;
    }
    update() {
        this.gameObject.x = this.x;
        this.gameObject.y = this.y;
        Lifecycle.update(this);
    }
    destroy() {
        Lifecycle.destroy(this);
    }
}
