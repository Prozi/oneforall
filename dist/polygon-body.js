"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class PolygonBody extends detect_collisions_1.Polygon {
    constructor(gameObject, points) {
        super(gameObject, points.map(([x, y]) => ({ x, y })));
        this.name = 'PolygonBody';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    update() {
        this.gameObject.x = this.x;
        this.gameObject.y = this.y;
        lifecycle_1.Lifecycle.update(this);
    }
    destroy() {
        lifecycle_1.Lifecycle.destroy(this);
    }
}
exports.PolygonBody = PolygonBody;
