import { Subject } from 'rxjs/internal/Subject';
import { BodyOptions, Ellipse } from 'detect-collisions';
import { GameObject } from './game-object';
import { IComponent } from './lifecycle';
export declare class CircleBody extends Ellipse implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, radiusX: number, radiusY?: number, step?: number, options?: BodyOptions);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=circle-body.d.ts.map