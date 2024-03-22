"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneBase = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const detect_collisions_1 = require("detect-collisions");
const lifecycle_1 = require("./lifecycle");
class SceneBase extends lifecycle_1.Lifecycle {
    constructor(options = {}) {
        super();
        this.label = 'Scene';
        this.children$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.physics = new detect_collisions_1.System(options.nodeMaxEntries);
        this.scale = options.scale || 1;
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
