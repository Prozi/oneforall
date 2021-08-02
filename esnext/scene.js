var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import { AutoInject } from '@jacekpietal/dependency-injection';
import { Application } from './application';
import { Physics } from './physics';
import { Resources } from './resources';
export class Scene {
    constructor(options = {}) {
        this.children = new Set();
        this.children$ = new Subject();
        this.container = new PIXI.Container();
        this.name = options.name || 'Scene';
        this.container.visible = options.visible || false;
        this.container.position.set(options.x || 0, options.y || 0);
        this.container.scale.set(options.scale || 1);
        this.stage.addChild(this.container);
    }
    get stage() {
        return this.pixi.stage;
    }
    update() {
        this.physics.update();
        Array.from(this.children.values()).forEach((child) => child.update());
    }
    destroy() {
        this.stage.removeChild(this.container);
        this.container.destroy();
    }
    addChild(child) {
        if (this.children.has(child)) {
            return;
        }
        this.children.add(child);
        this.children$.next();
    }
    removeChild(child) {
        if (!this.children.has(child)) {
            return;
        }
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
    AutoInject(Application)
], Scene.prototype, "pixi", void 0);
__decorate([
    AutoInject(Resources)
], Scene.prototype, "resouces", void 0);
__decorate([
    AutoInject(Physics)
], Scene.prototype, "physics", void 0);
