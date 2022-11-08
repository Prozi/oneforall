import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { ILifecycle } from './lifecycle';
export declare class Container extends PIXI.Container implements ILifecycle {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=container.d.ts.map