"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const component_1 = require("./component");
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
        component_1.Component.update(this);
    }
    destroy() {
        component_1.Component.destroy(this);
    }
}
exports.PolygonBody = PolygonBody;
