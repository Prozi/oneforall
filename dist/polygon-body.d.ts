import { BodyOptions, Polygon, Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
export declare class PolygonBody extends Polygon implements LifecycleProps {
    label: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<number>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions);
    update(deltaTime: number): void;
    destroy(): void;
}
//# sourceMappingURL=polygon-body.d.ts.map