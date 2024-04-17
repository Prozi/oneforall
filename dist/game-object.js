"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class GameObject {
    constructor(label = 'GameObject', x = 0, y = 0) {
        /**
         * When Lifecycle Object is updated, it emits this subject.
         * Along with updating his children, which in turn behave the same.
         */
        this.update$ = new Subject_1.Subject();
        /**
         * When Lifecycle Object is destroyed, it emits and closes this subject.
         * Along with destroying his children, which in turn behave the same.
         */
        this.destroy$ = new Subject_1.Subject();
        /**
         * Each GameObject has children Lifecycle Objects.
         */
        this.children = [];
        this.label = label;
        this.x = x;
        this.y = y;
    }
    static async instantiate(prefab) {
        return prefab.instantiate();
    }
    update(deltaTime) {
        this.children.forEach((component) => {
            component.update(deltaTime);
        });
        lifecycle_1.Lifecycle.update(this, deltaTime);
    }
    destroy() {
        var _a;
        while (this.children.length) {
            const child = this.children.pop();
            // (!) does also child.gameObject.removeChild(child)
            child.destroy();
        }
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.removeChild(this);
        lifecycle_1.Lifecycle.destroy(this);
    }
    addChild(...children) {
        children.forEach((child) => {
            var _a;
            const index = this.children.indexOf(child);
            if (index !== -1) {
                return;
            }
            this.children.push(child);
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.addChild(child);
        });
    }
    removeChild(...children) {
        children.forEach((child) => {
            var _a;
            const index = this.children.indexOf(child);
            if (index === -1) {
                return;
            }
            this.children.splice(index, 1);
            (_a = this.scene) === null || _a === void 0 ? void 0 : _a.removeChild(child);
        });
    }
    getChildOfType(type) {
        return this.children.find(({ label }) => label === type);
    }
    getChildrenOfType(type) {
        return this.children.filter(({ label }) => label === type);
    }
}
exports.GameObject = GameObject;
