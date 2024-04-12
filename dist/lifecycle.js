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
        var _a;
        (_a = lifecycle.gameObject) === null || _a === void 0 ? void 0 : _a.removeComponent(lifecycle);
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
