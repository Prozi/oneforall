import { BodyOptions, Polygon, Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleParent, LifecycleProps } from './lifecycle';
export declare class PolygonBody extends Polygon implements LifecycleProps {
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
     * Parent GameObject is assigned at creation.
     */
    gameObject: LifecycleParent;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions);
    update(deltaTime: number): void;
    destroy(): void;
}
//# sourceMappingURL=polygon-body.d.ts.map