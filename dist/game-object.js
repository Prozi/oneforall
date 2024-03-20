"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class GameObject extends lifecycle_1.Lifecycle {
    constructor(name = 'GameObject', x = 0, y = 0) {
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
        var _a;
        (_a = this.components) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
            component.update();
        });
        super.update();
    }
    destroy() {
        var _a;
        (_a = this.components) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
            component.destroy();
        });
        this.components = undefined;
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
        if (index !== -1) {
            this.components.splice(index, 1);
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.removeChild(component);
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
