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
const detect_collisions_1 = require("detect-collisions");
const PIXI = __importStar(require("pixi.js"));
const Subject_1 = require("rxjs/internal/Subject");
const game_object_1 = require("./game-object");
const lifecycle_1 = require("./lifecycle");
class SceneBase {
    constructor(options = {}) {
        this.children$ = new Subject_1.Subject();
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.label = 'Scene';
        this.animationFrame = 0;
        this.children = [];
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
        this.lastUpdate = Date.now();
        const frame = () => {
            const now = Date.now();
            const deltaTime = (now - (this.lastUpdate || now)) / 16.67;
            this.update(deltaTime);
            this.lastUpdate = now;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.animationFrame = requestAnimationFrame(frame);
        };
        frame();
    }
    update(deltaTime) {
        this.physics.update();
        this.children.forEach((child) => {
            if (child instanceof lifecycle_1.Lifecycle) {
                child.update(deltaTime);
            }
        });
        lifecycle_1.Lifecycle.update(this, deltaTime);
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
            child.scene = this;
            if (child instanceof game_object_1.GameObject) {
                child.components.forEach((component) => {
                    if (component instanceof PIXI.Container) {
                        this.stage.addChild(component);
                    }
                });
            }
            else if (child instanceof PIXI.Container) {
                this.stage.addChild(child);
            }
            const index = this.children.indexOf(child);
            if (index === -1) {
                this.children.push(child);
            }
        });
        this.children$.next();
    }
    removeChild(...children) {
        children.forEach((child) => {
            child.scene = null;
            if (child instanceof game_object_1.GameObject) {
                child.components.forEach((component) => {
                    if (component instanceof PIXI.Container) {
                        this.stage.removeChild(component);
                    }
                });
            }
            else if (child instanceof PIXI.Container) {
                this.stage.removeChild(child);
            }
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
