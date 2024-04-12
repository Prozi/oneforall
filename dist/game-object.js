"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const lifecycle_1 = require("./lifecycle");
class GameObject extends lifecycle_1.Lifecycle {
    constructor(label = 'GameObject', x = 0, y = 0) {
        super();
        /**
         * Each GameObject has children Lifecycle Objects.
         */
        this.components = [];
        this.label = label;
        this.x = x;
        this.y = y;
    }
    static async instantiate(prefab) {
        return prefab.instantiate();
    }
    update(deltaTime) {
        this.components.forEach((component) => {
            component.update(deltaTime);
        });
        super.update(deltaTime);
    }
    destroy() {
        var _a;
        while (this.components.length) {
            const component = this.components.pop();
            // will also gameObject.removeComponent(component)
            component.destroy();
        }
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.removeChild(this);
        super.destroy();
    }
    addComponent(component) {
        var _a;
        const index = this.components.indexOf(component);
        if (index !== -1) {
            return false;
        }
        this.components.push(component);
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.addChild(component);
        return true;
    }
    removeComponent(component) {
        var _a;
        const index = this.components.indexOf(component);
        if (index === -1) {
            return false;
        }
        this.components.splice(index, 1);
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.removeChild(component);
        return true;
    }
    getComponentOfType(type) {
        return this.components.find(({ label }) => label === type);
    }
    getComponentsOfType(type) {
        return this.components.filter(({ label }) => label === type);
    }
}
exports.GameObject = GameObject;
