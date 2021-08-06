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
        this.container = new PIXI.Container();
        this.destroy$ = new Subject();
        this.name = options.name || 'Scene';
        this.container.visible = options.visible || false;
        this.container.scale.set(options.scale || 1);
        if (options.autoSize) {
            this.enableAutoSize();
        }
        if (options.autoSort) {
            this.enableAutoSort();
        }
        this.stage.addChild(this.container);
    }
    get stage() {
        return this.pixi.stage;
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
        this.stage.scale.set(this.container.scale.x, this.container.scale.y);
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
            this.pixi.stage.children.sort((a, b) => a.y - b.y);
        });
    }
    update() {
        this.physics.update();
        Array.from(this.children.values()).forEach((child) => child.update());
        super.update();
    }
    destroy() {
        this.stage.removeChild(this.container);
        this.container.destroy();
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
