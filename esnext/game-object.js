import { Subject } from 'rxjs';
export class GameObject {
    constructor(name = 'GameObject', x = 0, y = 0) {
        this.components = new Set();
        this.components$ = new Subject();
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static instantiate(prefab) {
        return prefab.instantiate();
    }
    update() {
        const components = Array.from(this.components.values());
        components.forEach((component) => component.update());
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
        const components = Array.from(this.components.values());
        return components.find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        const components = Array.from(this.components.values());
        return components.filter(({ name }) => name === type);
    }
}
