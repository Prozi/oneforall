import { Subject } from 'rxjs';
import { Polygon } from 'detect-collisions';
import { Lifecycle } from '.';
export class PolygonBody extends Polygon {
    constructor(gameObject, points) {
        super(gameObject, points.map(([x, y]) => ({ x, y })));
        this.name = 'PolygonBody';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
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
