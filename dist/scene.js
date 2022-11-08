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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const PIXI = __importStar(require("pixi.js"));
const operators_1 = require("rxjs/operators");
const fromEvent_1 = require("rxjs/internal/observable/fromEvent");
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
const application_1 = require("./application");
const resources_1 = require("./resources");
const scene_base_1 = require("./scene-base");
class Scene extends scene_base_1.SceneBase {
    constructor(options = {}) {
        super(options);
        this.stage = new PIXI.Container();
        // 1 additonal layer
        this.stage.visible = options.visible || false;
        if (options.autoSize) {
            this.enableAutoSize();
        }
        if (options.autoSort) {
            this.enableAutoSort();
        }
        // real stage
        this.pixi.stage.addChild(this.stage);
    }
    start() {
        this.pixi.stage.scale.set(this.scale);
        this.pixi.start();
        super.start();
    }
    stop() {
        this.pixi.stop();
        super.stop();
    }
    destroy() {
        super.destroy();
        this.stage.parent.removeChild(this.stage);
        this.stage.destroy();
    }
    enableAutoSort() {
        this.update$.pipe((0, operators_1.takeUntil)(this.destroy$)).subscribe(() => {
            this.stage.children.sort((a, b) => a.y - b.y);
        });
    }
    enableAutoSize() {
        this.pixi.renderer.resize(innerWidth, innerHeight);
        (0, fromEvent_1.fromEvent)(window, "resize")
            .pipe((0, operators_1.takeUntil)(this.destroy$))
            .subscribe(() => {
            this.pixi.renderer.resize(innerWidth, innerHeight);
        });
    }
}
__decorate([
    (0, dependency_injection_1.Inject)(application_1.Application)
], Scene.prototype, "pixi", void 0);
__decorate([
    (0, dependency_injection_1.Inject)(resources_1.Resources)
], Scene.prototype, "resouces", void 0);
exports.Scene = Scene;
