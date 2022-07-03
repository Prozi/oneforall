"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const component_1 = require("./component");
class PolygonBody extends detect_collisions_1.Polygon {
    constructor(gameObject, points, options) {
        super(gameObject, points, options);
        this.name = 'PolygonBody';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
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
