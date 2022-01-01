"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const _1 = require(".");
class PolygonBody extends detect_collisions_1.Polygon {
    constructor(gameObject, points) {
        super(gameObject, points.map(([x, y]) => ({ x, y })));
        this.name = 'PolygonBody';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
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
        _1.Lifecycle.update(this);
    }
    destroy() {
        _1.Lifecycle.destroy(this);
    }
}
exports.PolygonBody = PolygonBody;
