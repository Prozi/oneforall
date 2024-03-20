import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleProps } from './lifecycle';
import { PIXIResource } from './resources';
export declare class Sprite extends PIXI.Sprite implements LifecycleProps {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, texture: PIXIResource);
    update(): void;
}
//# sourceMappingURL=sprite.d.ts.map