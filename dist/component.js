"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class Component {
    constructor(gameObject) {
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
         * Each Lifecycle Object has label for pixi debugging.
         */
        this.label = 'Component';
        gameObject.addChild(this);
    }
    update(deltaTime) {
        lifecycle_1.Lifecycle.update(this, deltaTime);
    }
    destroy() {
        lifecycle_1.Lifecycle.destroy(this);
    }
}
exports.Component = Component;
