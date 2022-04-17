"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleBody = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class CircleBody extends detect_collisions_1.Oval {
    constructor(gameObject, radiusX, radiusY = radiusX, step = 10) {
        super(gameObject, radiusX, radiusY, step);
        this.name = 'CircleBody';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        if (!radiusX || !radiusY) {
            throw new Error("CircleBody radius[X|Y] can't be 0!");
        }
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
exports.CircleBody = CircleBody;
