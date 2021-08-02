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
        Lifecycle.destroy(this);
    }
    addComponent(component) {
        if (this.components.has(component)) {
            return;
        }
        this.components.add(component);
        this.components$.next();
    }
    removeComponent(component) {
        if (!this.components.has(component)) {
            return;
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
