import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import { Component } from './component';
export class Container extends PIXI.Container {
    constructor(gameObject) {
        super();
        this.name = 'Container';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    update() {
        var _a;
        if (!this.parent) {
            (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.addChild(this);
        }
        this.x = this.gameObject.x;
        this.y = this.gameObject.y;
        Component.update(this);
    }
    destroy() {
        var _a;
        (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.removeChild(this);
        super.destroy();
        Component.destroy(this);
    }
}
