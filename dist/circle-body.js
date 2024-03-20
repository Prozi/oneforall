"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleBody = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class CircleBody extends detect_collisions_1.Ellipse {
    constructor(gameObject, radiusX, radiusY = radiusX, step = 16, options) {
        super(gameObject, radiusX, radiusY, step, options);
        this.name = 'CircleBody';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        if (!radiusX || !radiusY) {
            throw new Error('CircleBody radius can\'t be 0!');
        }
        this.gameObject = gameObject;
        // tslint:disable-next-line: no-any
        this.gameObject.addComponent(this);
    }
    update() {
        this.gameObject.x = this.x;
        this.gameObject.y = this.y;
        lifecycle_1.Lifecycle.prototype.update.call(this);
    }
    destroy() {
        lifecycle_1.Lifecycle.prototype.destroy.call(this);
    }
}
exports.CircleBody = CircleBody;
