import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import { IComponent } from './component';
import { GameObject } from './game-object';
export declare class Container extends PIXI.Container implements IComponent {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=container.d.ts.map