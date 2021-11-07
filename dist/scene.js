var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as PIXI from 'pixi.js';
import { fromEvent, Subject, takeUntil } from 'rxjs';
import { Inject } from '@jacekpietal/dependency-injection';
import { Application } from './application';
import { Physics } from './physics';
import { Resources } from './resources';
import { Lifecycle } from './component';
export class Scene extends Lifecycle {
    constructor(options = {}) {
        super();
        this.children = new Set();
        this.children$ = new Subject();
        this.stage = new PIXI.Container();
        this.destroy$ = new Subject();
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
        fromEvent(window, 'resize')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.pixi.renderer.resize(innerWidth, innerHeight);
        });
    }
    enableAutoSort() {
        this.update$.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    Inject(Application)
], Scene.prototype, "pixi", void 0);
__decorate([
    Inject(Resources)
], Scene.prototype, "resouces", void 0);
__decorate([
    Inject(Physics)
], Scene.prototype, "physics", void 0);
