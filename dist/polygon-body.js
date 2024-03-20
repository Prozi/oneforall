"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonBody = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class PolygonBody extends detect_collisions_1.Polygon {
    constructor(gameObject, points, options) {
        super(gameObject, points, options);
        this.name = 'PolygonBody';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
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
exports.PolygonBody = PolygonBody;
