"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneBase = void 0;
const rxjs_1 = require("rxjs");
const detect_collisions_1 = require("detect-collisions");
const component_1 = require("./component");
class SceneBase extends component_1.Lifecycle {
    constructor(options = {}) {
        super();
        this.children = new Set();
        this.children$ = new rxjs_1.Subject();
        this.stage = { addChild() { }, removeChild() { }, children: [] };
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
