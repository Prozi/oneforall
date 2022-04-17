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
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class SceneBase extends lifecycle_1.Lifecycle {
    constructor(options = {}) {
        super();
        this.children = new Set();
        this.children$ = new rxjs_1.Subject();
        this.stage = {
            addChild() {
                console.warn('missing addChild implementation');
            },
            removeChild() {
                console.warn('missing removeChild implementation');
            },
            children: [],
            scale: new PIXI.Point(1, 1)
        };
        this.physics = new detect_collisions_1.System();
        this.destroy$ = new rxjs_1.Subject();
        this.name = options.name || 'Scene';
        this.scale = options.scale || 1;
    }
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
        Array.from(this.children.values()).forEach((child) => child.update());
        super.update();
    }
    destroy() {
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
exports.SceneBase = SceneBase;
