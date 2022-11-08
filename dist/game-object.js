"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class GameObject extends lifecycle_1.Lifecycle {
    constructor(name = "GameObject", x = 0, y = 0) {
        super();
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.components = [];
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static async instantiate(prefab) {
        return prefab.instantiate();
    }
    update() {
        this.components.forEach((component) => {
            component.update();
        });
        super.update();
    }
    destroy() {
        var _a;
        this.components.forEach((component) => {
            component.destroy();
        });
        this.components = undefined;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this);
        super.destroy();
    }
    addComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            return false;
        }
        this.components.push(component);
        return true;
    }
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
        return index !== -1;
    }
    getComponentOfType(type) {
        return this.components.find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        return this.components.filter(({ name }) => name === type);
    }
}
exports.GameObject = GameObject;
