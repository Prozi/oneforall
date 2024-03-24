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
class SceneBase {
    constructor(options = {}) {
        this.label = 'Scene';
        this.animationFrame = 0;
        this.children = [];
        this.children$ = new Subject_1.Subject();
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.stage = new PIXI.Container();
        this.stage.label = 'Stage';
        this.physics = new detect_collisions_1.System(options.nodeMaxEntries);
    }
    // tslint:disable-next-line
    async init(_options) { }
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    start() {
        const frame = () => {
            this.update();
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.animationFrame = requestAnimationFrame(frame);
        };
        frame();
    }
    update() {
        this.physics.update();
        this.children.forEach((child) => {
            if (child instanceof lifecycle_1.Lifecycle) {
                child.update();
            }
        });
        lifecycle_1.Lifecycle.update(this);
    }
    destroy() {
        this.stop();
        while (this.children.length) {
            const child = this.children.pop();
            // will also gameObject.removeComponent(component)
            child.destroy();
        }
        this.children$.complete();
        lifecycle_1.Lifecycle.destroy(this);
    }
    addChild(...children) {
        children.forEach((child) => {
            if (child.sprite instanceof lifecycle_1.Lifecycle) {
                this.addChild(child.sprite);
            }
            else if (child.sprite instanceof PIXI.Container) {
                this.stage.addChild(child.sprite);
            }
            else if (child instanceof PIXI.Container) {
                this.stage.addChild(child);
            }
            child.scene = this;
            const index = this.children.indexOf(child);
            if (index === -1) {
                this.children.push(child);
            }
        });
        this.children$.next();
    }
    removeChild(...children) {
        children.forEach((child) => {
            if (child.sprite instanceof PIXI.Container) {
                this.stage.removeChild(child.sprite);
            }
            else if (child instanceof PIXI.Container) {
                this.stage.removeChild(child);
            }
            child.scene = null;
            const index = this.children.indexOf(child);
            if (index !== -1) {
                this.children.splice(index, 1);
            }
        });
        this.children$.next();
    }
    getChildOfType(type) {
        return this.children.find(({ label }) => label === type);
    }
    getChildrenOfType(type) {
        return this.children.filter(({ label }) => label === type);
    }
}
exports.SceneBase = SceneBase;
