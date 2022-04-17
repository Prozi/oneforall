"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = void 0;
const rxjs_1 = require("rxjs");
class Lifecycle {
    constructor() {
        this.name = 'Lifecycle';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
    }
    static destroy(lifecycle) {
        lifecycle.destroy$.next();
        lifecycle.destroy$.complete();
    }
    static update(lifecycle) {
        lifecycle.update$.next();
    }
    update() {
        Lifecycle.update(this);
    }
    destroy() {
        Lifecycle.destroy(this);
    }
}
exports.Lifecycle = Lifecycle;
