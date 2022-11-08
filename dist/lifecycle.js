"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = void 0;
const Subject_1 = require("rxjs/internal/Subject");
class Lifecycle {
    constructor() {
        this.name = "Lifecycle";
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
    }
    destroy() {
        var _a, _b, _c;
        (_a = this.update$) === null || _a === void 0 ? void 0 : _a.complete();
        (_b = this.destroy$) === null || _b === void 0 ? void 0 : _b.next();
        (_c = this.destroy$) === null || _c === void 0 ? void 0 : _c.complete();
        this.update$ = undefined;
        this.destroy$ = undefined;
        this.gameObject = undefined;
    }
    update() {
        this.update$.next();
    }
}
exports.Lifecycle = Lifecycle;
