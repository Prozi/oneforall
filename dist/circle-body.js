"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleBody = void 0;
const detect_collisions_1 = require("detect-collisions");
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class CircleBody extends detect_collisions_1.Ellipse {
    constructor(gameObject, radiusX, radiusY = radiusX, step = 16, options) {
        super(gameObject, radiusX, radiusY, step, options);
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.label = 'CircleBody';
        if (!radiusX || !radiusY) {
            throw new Error('CircleBody radius can\'t be 0!');
        }
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    update(deltaTime) {
        this.gameObject.x = this.x;
        this.gameObject.y = this.y;
        lifecycle_1.Lifecycle.update(this, deltaTime);
    }
    destroy() {
        var _a;
        (_a = this.system) === null || _a === void 0 ? void 0 : _a.remove(this);
        lifecycle_1.Lifecycle.destroy(this);
    }
}
exports.CircleBody = CircleBody;
