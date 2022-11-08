import * as PIXI from "pixi.js";
import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";
import { ILifecycle } from "./lifecycle";
export declare class Sprite extends PIXI.Sprite implements ILifecycle {
    readonly name: string;
    readonly gameObject: GameObject;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(gameObject: GameObject, texture: PIXI.Texture);
    update(): void;
    destroy(): void;
}
//# sourceMappingURL=sprite.d.ts.map