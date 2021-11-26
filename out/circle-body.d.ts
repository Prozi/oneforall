import { Subject } from 'rxjs';
import { Circle } from 'detect-collisions';
import { GameObject } from './game-object';
import { IComponent } from '.';
export declare class CircleBody extends Circle implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, radius: number);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=circle-body.d.ts.map