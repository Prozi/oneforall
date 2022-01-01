"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleBody = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const _1 = require(".");
class CircleBody extends detect_collisions_1.Circle {
    constructor(gameObject, radius) {
        super(gameObject, radius);
        this.name = 'CircleBody';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        if (!radius) {
            throw new Error("CircleBody radius can't be 0!");
        }
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
exports.CircleBody = CircleBody;
