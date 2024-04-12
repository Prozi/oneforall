import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
export declare class Container extends PIXI.Container implements LifecycleProps {
    readonly gameObject: GameObject;
    readonly update$: Subject<number>;
    readonly destroy$: Subject<void>;
    label: string;
    constructor(gameObject: GameObject);
    update(deltaTime: number): void;
    destroy(): void;
}
//# sourceMappingURL=container.d.ts.map