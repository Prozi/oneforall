"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = exports.Lifecycle = void 0;
const rxjs_1 = require("rxjs");
class Lifecycle {
    constructor() {
        this.name = 'Lifecycle';
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
    }
    static destroy(lifecycle) {
        lifecycle.destroy$.next();
        lifecycle.destroy$.complete();
    }
    static update(lifecycle) {
        lifecycle.update$.next();
    }
    update() {
        Lifecycle.update(this);
    }
    destroy() {
        Lifecycle.destroy(this);
    }
}
exports.Lifecycle = Lifecycle;
class Component extends Lifecycle {
    constructor(gameObject) {
        super();
        this.name = 'Component';
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    static destroy(component) {
        component.gameObject.removeComponent(component);
        Lifecycle.destroy(component);
    }
    static update(component) {
        Lifecycle.update(component);
    }
    destroy() {
        Component.destroy(this);
    }
}
exports.Component = Component;
