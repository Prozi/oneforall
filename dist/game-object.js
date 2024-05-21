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
    /**
     * get root scene
     */
    get root() {
        let cursor = this.gameObject;
        while (cursor === null || cursor === void 0 ? void 0 : cursor.gameObject) {
            cursor = cursor.gameObject;
        }
        return cursor;
    }
    update(deltaTime) {
        this.children.forEach((child) => {
            child.update(deltaTime);
        });
        lifecycle_1.Lifecycle.update(this, deltaTime);
    }
    destroy() {
        while (this.children.length) {
            const child = this.children.pop();
            // (!) does also child.gameObject.removeChild(child)
            child.destroy();
        }
        lifecycle_1.Lifecycle.destroy(this);
    }
    addChild(...children) {
        const root = this.root;
        children.forEach((child) => {
            const index = this.children.indexOf(child);
            if (index === -1) {
                // add to root scene if exists
                root === null || root === void 0 ? void 0 : root.addChild(child);
                this.children.push(child);
                child.gameObject = this;
            }
        });
    }
    removeChild(...children) {
        const root = this.root;
        children.forEach((child) => {
            const index = this.children.indexOf(child);
            if (index !== -1) {
                // remove from root scene if exists
                root === null || root === void 0 ? void 0 : root.removeChild(child);
                this.children.splice(index, 1);
                child.gameObject = null;
            }
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
