import { Subject } from 'rxjs';
import { Polygon } from 'detect-collisions';
import { GameObject } from './game-object';
import { IComponent } from '.';
export declare class PolygonBody extends Polygon implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, points: number[][]);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=polygon-body.d.ts.map