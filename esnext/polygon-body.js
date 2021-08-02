var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AutoInject } from '@jacekpietal/dependency-injection';
import { Physics } from './physics';
import { Component } from './component';
export class PolygonBody extends Component {
    constructor(gameObject, points) {
        super(gameObject);
        this.name = 'PolygonBody';
        this.polygon = this.physics.createPolygon(this.gameObject.x, this.gameObject.y, points);
    }
    get x() {
        return this.polygon.x;
    }
    set x(x) {
        this.polygon.x = x;
    }
    get y() {
        return this.polygon.y;
    }
    set y(y) {
        this.polygon.y = y;
    }
    update() {
        this.gameObject.x = this.polygon.x;
        this.gameObject.y = this.polygon.y;
        super.update();
    }
    destroy() {
        this.physics.remove(this.polygon);
        super.destroy();
    }
}
__decorate([
    AutoInject(Physics)
], PolygonBody.prototype, "physics", void 0);
