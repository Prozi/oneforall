import { Subject } from 'rxjs';
import { Lifecycle } from './component';
export class GameObject {
    constructor(name = 'GameObject', x = 0, y = 0) {
        this.update$ = new Subject();
        this.destroy$ = new Subject();
        this.components = new Set();
        this.components$ = new Subject();
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static async instantiate(prefab) {
        return await prefab.instantiate();
    }
    update() {
        Array.from(this.components.values()).forEach((component) => component.update());
        Lifecycle.update(this);
    }
    destroy() {
        Array.from(this.components.values()).forEach((component) => this.removeComponent(component));
        Lifecycle.destroy(this);
    }
    addComponent(component, key = component.key || '') {
        if (this.components.has(component)) {
            return;
        }
        this.components.add(component);
        this.components$.next();
        if (key) {
            component.key = key;
            this[key] = component;
        }
        return component;
    }
    removeComponent(component, key = component.key || '') {
        if (!this.components.has(component)) {
            return;
        }
        if (key && this[key]) {
            this[key] = null;
        }
        this.components.delete(component);
        this.components$.next();
    }
    getComponentOfType(type) {
        return Array.from(this.components.values()).find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        return Array.from(this.components.values()).filter(({ name }) => name === type);
    }
}
