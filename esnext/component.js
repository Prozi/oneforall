import { Subject } from 'rxjs';
export class Component {
    constructor(gameObject) {
        this.name = 'Component';
        this.update$ = new Subject();
        this.destroy$ = new Subject();
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    static destroy(component) {
        component.gameObject.removeComponent(component);
        component.destroy$.next();
        component.destroy$.complete();
        component.update$.complete();
    }
    static update(component) {
        component.update$.next();
    }
    update() {
        Component.update(this);
    }
    destroy() {
        Component.destroy(this);
    }
}
