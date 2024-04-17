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
const pixi_stats_1 = require("pixi-stats");
const PIXI = __importStar(require("pixi.js"));
const merge_1 = require("rxjs/internal/observable/merge");
const takeUntil_1 = require("rxjs/internal/operators/takeUntil");
const Subject_1 = require("rxjs/internal/Subject");
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
const application_1 = require("./application");
const resources_1 = require("./resources");
const scene_base_1 = require("./scene-base");
class Scene extends scene_base_1.SceneBase {
    constructor(options = {}) {
        super(options);
        /**
         * When disableAutoSort is called, it emits this subject.
         */
        this.disableAutoSort$ = new Subject_1.Subject();
        /**
         * When disableDebug is called, it emits this subject.
         */
        this.disableDebug$ = new Subject_1.Subject();
        this.stage.visible = this.options.visible || false;
        this.pixi.stage.addChild(this.stage);
        if (this.options.autoSort) {
            this.enableAutoSort();
        }
        if (this.options.debug) {
            this.enableDebug();
        }
        // for chrome plugin pixi debug devtools
        globalThis.__PIXI_APP__ = this.pixi;
    }
    static getQueryParams() {
        const matches = location.search.matchAll(/[?&]([^=?&]+)=?([^?&]*)/g);
        return [...matches].reduce((queryParams, [_wholeMatch, paramName, paramValue]) => (Object.assign(Object.assign({}, queryParams), { [paramName]: paramValue })), {});
    }
    async init(options) {
        await this.pixi.init(options);
        document.body.appendChild(this.pixi.canvas);
        const showFPS = this.options.showFPS;
        if (showFPS) {
            this.showFPS(typeof showFPS === 'string' ? showFPS : undefined);
        }
    }
    start() {
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
        this.pixi.stage.removeChild(this.stage);
    }
    enableAutoSort() {
        this.update$
            .pipe((0, takeUntil_1.takeUntil)((0, merge_1.merge)(this.destroy$, this.disableAutoSort$)))
            .subscribe(() => {
            this.stage.children.sort((bodyA, bodyB) => bodyA.y - bodyB.y);
        });
    }
    disableAutoSort() {
        this.disableAutoSort$.next();
    }
    enableDebug() {
        const debug = new PIXI.Graphics();
        const canvas = debug;
        this.pixi.stage.addChild(debug);
        this.update$
            .pipe((0, takeUntil_1.takeUntil)((0, merge_1.merge)(this.destroy$, this.disableDebug$)))
            .subscribe(() => {
            debug.clear();
            this.physics.drawBVH(canvas);
            this.physics.draw(canvas);
            debug.stroke();
        });
    }
    disableDebug() {
        this.disableDebug$.next();
        this.pixi.stage.children.forEach((child) => {
            if (child instanceof PIXI.Graphics) {
                this.pixi.stage.removeChild(child);
                child.destroy();
            }
        });
    }
    /**
     * add body font family to set font of pixi-stats
     */
    showFPS(style = 'position: fixed; top: 0; right: 0; z-index: 1000;') {
        const stats = (0, pixi_stats_1.addStats)(document, this.pixi);
        const ticker = PIXI.Ticker.shared;
        const canvas = stats.stats.domElement;
        canvas.setAttribute('style', style);
        ticker.add(stats.update, stats, PIXI.UPDATE_PRIORITY.UTILITY);
    }
}
__decorate([
    (0, dependency_injection_1.Inject)(application_1.Application)
], Scene.prototype, "pixi", void 0);
__decorate([
    (0, dependency_injection_1.Inject)(resources_1.Resources)
], Scene.prototype, "resources", void 0);
exports.Scene = Scene;
