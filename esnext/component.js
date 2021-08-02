import { Subject } from 'rxjs';
export class Lifecycle {
    constructor() {
        this.name = 'Lifecycle';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
    }
    static destroy(lifecycle) {
        lifecycle.destroy$.next();
        lifecycle.destroy$.complete();
        lifecycle.update$.complete();
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
export class Component extends Lifecycle {
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
