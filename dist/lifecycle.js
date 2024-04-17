"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const game_object_1 = require("./game-object");
class Lifecycle {
    constructor() {
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
        this.label = 'Lifecycle';
    }
    static destroy(lifecycle) {
        if (!(lifecycle instanceof game_object_1.GameObject)) {
            lifecycle.gameObject.removeChild(lifecycle);
        }
        lifecycle.update$.complete();
        lifecycle.destroy$.next();
        lifecycle.destroy$.complete();
    }
    static update(lifecycle, deltaTime) {
        lifecycle.update$.next(deltaTime);
    }
    destroy() {
        Lifecycle.destroy(this);
    }
    update(deltaTime) {
        Lifecycle.update(this, deltaTime);
    }
}
exports.Lifecycle = Lifecycle;
