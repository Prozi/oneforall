"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const lifecycle_1 = require("./lifecycle");
class Component extends lifecycle_1.Lifecycle {
    constructor(gameObject) {
        super();
        this.name = 'Component';
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    static destroy(component) {
        component.gameObject.removeComponent(component);
        lifecycle_1.Lifecycle.destroy(component);
    }
    static update(component) {
        lifecycle_1.Lifecycle.update(component);
    }
    destroy() {
        Component.destroy(this);
    }
}
exports.Component = Component;
