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
exports.Sprite = void 0;
const PIXI = __importStar(require("pixi.js"));
const Subject_1 = require("rxjs/internal/Subject");
const component_1 = require("./component");
class Sprite extends PIXI.Sprite {
    constructor(gameObject, texture) {
        super(texture);
        this.name = "Sprite";
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    update() {
        var _a;
        if (!this.parent) {
            (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.addChild(this);
        }
        this.x = this.gameObject.x;
        this.y = this.gameObject.y;
        component_1.Component.prototype.update.call(this);
    }
    destroy() {
        var _a;
        (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.removeChild(this);
        super.destroy();
        component_1.Component.prototype.destroy.call(this);
    }
}
exports.Sprite = Sprite;
