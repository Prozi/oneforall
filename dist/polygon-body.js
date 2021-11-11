var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Subject } from 'rxjs';
import { Polygon } from 'detect-collisions';
import { Inject } from '@jacekpietal/dependency-injection';
import { Physics } from './physics';
import { Lifecycle } from '.';
export class PolygonBody extends Polygon {
    constructor(gameObject, points) {
        super(gameObject, points.map(([x, y]) => ({ x, y })));
        this.name = 'PolygonBody';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
        this.physics.insert(this);
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
        this.physics.remove(this);
        Lifecycle.destroy(this);
    }
}
__decorate([
    Inject(Physics)
], PolygonBody.prototype, "physics", void 0);
