"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class Component {
    constructor(gameObject) {
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.label = 'Component';
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    update(deltaTime) {
        lifecycle_1.Lifecycle.update(this, deltaTime);
    }
    destroy() {
        lifecycle_1.Lifecycle.destroy(this);
    }
}
exports.Component = Component;
