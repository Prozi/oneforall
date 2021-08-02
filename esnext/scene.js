var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as PIXI from 'pixi.js';
import { AutoInject } from 'ts-dependency-injection';
import { Application } from './application';
import { Lifecycle } from './component';
export class Scene extends Lifecycle {
    constructor(visible = false) {
        super();
        this.name = 'Scene';
        this.container = new PIXI.Container();
        this.container.visible = visible;
        this.stage.addChild(this.container);
    }
    get stage() {
        return this.app.stage;
    }
    destroy() {
        this.stage.removeChild(this.container);
        this.container.destroy();
        super.destroy();
    }
}
__decorate([
    AutoInject(Application)
], Scene.prototype, "app", void 0);
