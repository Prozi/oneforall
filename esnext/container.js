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
        this.x = this.gameObject.x;
        this.y = this.gameObject.y;
        Component.update(this);
    }
    destroy() {
        super.destroy();
        Component.destroy(this);
    }
}
