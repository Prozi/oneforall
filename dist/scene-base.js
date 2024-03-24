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
exports.SceneBase = void 0;
const PIXI = __importStar(require("pixi.js"));
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class SceneBase extends lifecycle_1.Lifecycle {
    constructor(options = {}) {
        super();
        this.label = 'Scene';
        this.stage = new PIXI.Container();
        this.children$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.scale = options.scale || 1;
        this.physics = new detect_collisions_1.System(options.nodeMaxEntries);
        this.stage.label = 'Stage';
    }
    // tslint:disable-next-line
    async init(_options) { }
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    start() {
        const loop = () => {
            this.update();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }
    update() {
        this.physics.update();
        this.children.forEach((child) => {
            if (child instanceof lifecycle_1.Lifecycle) {
                child.update();
            }
        });
        super.update();
    }
    destroy() {
        this.stop();
        while (this.children.length) {
            const component = this.children.pop();
            // will also gameObject.removeComponent(component)
            component.destroy();
        }
        this.children$.complete();
        this.children$ = undefined;
        super.destroy();
    }
    addChild(...children) {
        const result = super.addChild(...children);
        children.forEach((child) => {
            child.scene = this;
        });
        this.children$.next();
        return result;
    }
    removeChild(...children) {
        const result = super.removeChild(...children);
        children.forEach((child) => {
            child.scene = null;
        });
        this.children$.next();
        return result;
    }
    getChildOfType(type) {
        return this.children.find(({ label }) => label === type);
    }
    getChildrenOfType(type) {
        return this.children.filter(({ label }) => label === type);
    }
}
exports.SceneBase = SceneBase;
