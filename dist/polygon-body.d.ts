import { Subject } from 'rxjs/internal/Subject';
import { BodyOptions, Polygon, Vector } from 'detect-collisions';
import { GameObject } from './game-object';
import { IComponent } from './lifecycle';
export declare class PolygonBody extends Polygon implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, points: Vector[], options?: BodyOptions);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=polygon-body.d.ts.map