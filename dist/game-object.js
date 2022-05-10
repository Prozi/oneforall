"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const rxjs_1 = require("rxjs");
const lifecycle_1 = require("./lifecycle");
class GameObject {
    constructor(name = 'GameObject', x = 0, y = 0) {
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        this.components = [];
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static async instantiate(prefab) {
        return await prefab.instantiate();
    }
    update() {
        this.components.forEach((component) => component.update());
        lifecycle_1.Lifecycle.update(this);
    }
    destroy() {
        this.components.forEach((component) => component.destroy());
        lifecycle_1.Lifecycle.destroy(this);
    }
    addComponent(component) {
        if (this.components.includes(component)) {
            return false;
        }
        this.components.push(component);
        return true;
    }
    removeComponent(component) {
        if (!this.components.includes(component)) {
            return false;
        }
        this.components.splice(this.components.indexOf(component), 1);
        return true;
    }
    getComponentOfType(type) {
        return this.components.find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        return this.components.filter(({ name }) => name === type);
    }
}
exports.GameObject = GameObject;
