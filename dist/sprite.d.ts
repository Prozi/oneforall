import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
import { PIXIResource } from './resources';
export declare class Sprite extends PIXI.Sprite implements LifecycleProps {
    readonly gameObject: GameObject;
    readonly update$: Subject<number>;
    readonly destroy$: Subject<void>;
    label: string;
    constructor(gameObject: GameObject, texture: PIXIResource);
    update(deltaTime: number): void;
}
//# sourceMappingURL=sprite.d.ts.map