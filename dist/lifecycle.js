"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lifecycle = void 0;
const PIXI = __importStar(require("pixi.js"));
const Subject_1 = require("rxjs/internal/Subject");
class Lifecycle extends PIXI.Container {
    constructor() {
        super(...arguments);
        this.name = 'Lifecycle';
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
    }
    static destroy(lifecycle) {
        var _a, _b, _c, _d;
        console.log(((_a = lifecycle.gameObject) === null || _a === void 0 ? void 0 : _a.removeComponent(lifecycle))
            ? 'removed'
            : 'not removed', lifecycle.name);
        (_b = lifecycle.update$) === null || _b === void 0 ? void 0 : _b.complete();
        (_c = lifecycle.destroy$) === null || _c === void 0 ? void 0 : _c.next();
        (_d = lifecycle.destroy$) === null || _d === void 0 ? void 0 : _d.complete();
        lifecycle.update$ = undefined;
        lifecycle.destroy$ = undefined;
        lifecycle.gameObject = undefined;
    }
    static update(lifecycle) {
        var _a;
        (_a = lifecycle.update$) === null || _a === void 0 ? void 0 : _a.next();
    }
    destroy() {
        Lifecycle.destroy(this);
    }
    update() {
        Lifecycle.update(this);
    }
}
exports.Lifecycle = Lifecycle;
