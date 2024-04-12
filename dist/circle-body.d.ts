import { BodyOptions, Ellipse } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
export declare class CircleBody extends Ellipse implements LifecycleProps {
    /**
     * Parent GameObject is assigned at creation.
     */
    readonly gameObject: GameObject;
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    readonly update$: Subject<number>;
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    readonly destroy$: Subject<void>;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    constructor(gameObject: GameObject, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions);
    update(deltaTime: number): void;
    destroy(): void;
}
//# sourceMappingURL=circle-body.d.ts.map