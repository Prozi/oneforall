"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = void 0;
const Subject_1 = require("rxjs/internal/Subject");
class Lifecycle {
    constructor() {
        this.name = 'Lifecycle';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
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
