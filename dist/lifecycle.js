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
    destroy() {
        this.update$.complete();
        this.destroy$.next();
        this.destroy$.complete();
        this.update$ = undefined;
        this.destroy$ = undefined;
        this.gameObject = undefined;
    }
    update() {
        this.update$.next();
    }
}
exports.Lifecycle = Lifecycle;
