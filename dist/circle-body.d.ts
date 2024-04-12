import { BodyOptions, Ellipse } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
export declare class CircleBody extends Ellipse implements LifecycleProps {
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    label: string;
    constructor(gameObject: GameObject, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=circle-body.d.ts.map