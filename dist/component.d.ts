import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
export declare class Component implements LifecycleProps {
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    label: string;
    constructor(gameObject: GameObject);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=component.d.ts.map