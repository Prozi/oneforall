"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleBody = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const component_1 = require("./component");
class CircleBody extends detect_collisions_1.Ellipse {
    constructor(gameObject, radiusX, radiusY = radiusX, step, options) {
        super(gameObject, radiusX, radiusY, step, options);
        this.name = 'CircleBody';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        if (!radiusX || !radiusY) {
            throw new Error('CircleBody radius can\'t be 0!');
        }
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
exports.CircleBody = CircleBody;
