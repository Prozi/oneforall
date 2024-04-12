"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const detect_collisions_1 = require("detect-collisions");
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class PolygonBody extends detect_collisions_1.Polygon {
    constructor(gameObject, points, options) {
        super(gameObject, points, options);
        this.label = 'PolygonBody';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
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
exports.PolygonBody = PolygonBody;
