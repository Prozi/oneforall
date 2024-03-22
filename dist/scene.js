"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const operators_1 = require("rxjs/operators");
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
const application_1 = require("./application");
const resources_1 = require("./resources");
const scene_base_1 = require("./scene-base");
class Scene extends scene_base_1.SceneBase {
    constructor(options = {}) {
        super();
        this.options = {};
        this.options = options;
        // 1 additonal layer
        this.visible = options.visible || false;
        if (options.autoSort) {
            this.enableAutoSort();
        }
        // real stage
        this.pixi.stage.addChild(this);
    }
    async init(options) {
        this.pixi.init(options);
        document.body.appendChild(this.pixi.canvas);
    }
    start() {
        this.pixi.stage.scale.set(this.scale.x, this.scale.y);
        this.pixi.start();
        super.start();
    }
    stop() {
        var _a, _b;
        (_b = (_a = this.pixi).stop) === null || _b === void 0 ? void 0 : _b.call(_a);
        super.stop();
    }
    destroy() {
        super.destroy();
        this.pixi.stage.removeChild(this);
    }
    enableAutoSort() {
        this.update$.pipe((0, operators_1.takeUntil)(this.destroy$)).subscribe(() => {
            this.children.sort((a, b) => a.y - b.y);
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
