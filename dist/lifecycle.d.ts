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
//# sourceMappingURL=lifecycle.d.ts.map