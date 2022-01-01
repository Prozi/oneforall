"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
const application_1 = require("./application");
const resources_1 = require("./resources");
const component_1 = require("./component");
class Scene extends component_1.Lifecycle {
    constructor(options = {}) {
        super();
        this.children = new Set();
        this.children$ = new rxjs_1.Subject();
        this.physics = new detect_collisions_1.System();
        this.stage = new PIXI.Container();
        this.destroy$ = new rxjs_1.Subject();
        this.name = options.name || 'Scene';
        this.scale = options.scale || 1;
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
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.pixi.stop();
    }
    start() {
        const loop = () => {
            this.update();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
        this.pixi.stage.scale.set(this.scale);
        this.pixi.start();
    }
    enableAutoSize() {
        this.pixi.renderer.resize(innerWidth, innerHeight);
        (0, rxjs_1.fromEvent)(window, 'resize')
            .pipe((0, rxjs_1.takeUntil)(this.destroy$))
            .subscribe(() => {
            this.pixi.renderer.resize(innerWidth, innerHeight);
        });
    }
    enableAutoSort() {
        this.update$.pipe((0, rxjs_1.takeUntil)(this.destroy$)).subscribe(() => {
            this.stage.children.sort((a, b) => a.y - b.y);
        });
    }
    update() {
        this.physics.update();
        Array.from(this.children.values()).forEach((child) => child.update());
        super.update();
    }
    destroy() {
        var _a;
        (_a = this.stage.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this.stage);
        this.stage.destroy();
        this.stop();
        super.destroy();
    }
    addChild(child) {
        if (this.children.has(child)) {
            return;
        }
        child.parent = this;
        this.children.add(child);
        this.children$.next();
    }
    removeChild(child) {
        if (!this.children.has(child)) {
            return;
        }
        child.parent = null;
        this.children.delete(child);
        this.children$.next();
    }
    getChildOfType(type) {
        return Array.from(this.children.values()).find(({ name }) => name === type);
    }
    getChildrenOfType(type) {
        return Array.from(this.children.values()).filter(({ name }) => name === type);
    }
}
__decorate([
    (0, dependency_injection_1.Inject)(application_1.Application)
], Scene.prototype, "pixi", void 0);
__decorate([
    (0, dependency_injection_1.Inject)(resources_1.Resources)
], Scene.prototype, "resouces", void 0);
exports.Scene = Scene;
