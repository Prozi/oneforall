import { GameObject } from './game-object';
import { IComponent, Lifecycle } from './lifecycle';
export declare class Component extends Lifecycle implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    constructor(gameObject: GameObject);
    static destroy(component: Component): void;
    static update(component: Component): void;
    destroy(): void;
}
//# sourceMappingURL=component.d.ts.map