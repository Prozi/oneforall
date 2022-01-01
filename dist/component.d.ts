import { Subject } from 'rxjs';
import { GameObject } from './game-object';
export interface ILifecycle {
    readonly name: string;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    update(): void;
    destroy(): void;
}
export interface IComponent extends ILifecycle {
    readonly gameObject: GameObject;
    key?: string;
}
export declare class Lifecycle implements ILifecycle {
    readonly name: string;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    static destroy(lifecycle: ILifecycle): void;
    static update(lifecycle: ILifecycle): void;
    update(): void;
    destroy(): void;
}
export declare class Component extends Lifecycle implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    constructor(gameObject: GameObject);
    static destroy(component: Component): void;
    static update(component: Component): void;
    destroy(): void;
}
//# sourceMappingURL=component.d.ts.map