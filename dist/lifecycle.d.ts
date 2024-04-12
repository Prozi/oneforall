import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export interface LifecycleProps {
    label: string;
    scene?: SceneBase | Scene;
    update$?: Subject<number>;
    destroy$?: Subject<void>;
    gameObject?: GameObject;
    update(deltaTime: number): void;
    destroy(): void;
}
export declare class Lifecycle extends PIXI.Container implements LifecycleProps {
    readonly gameObject?: GameObject;
    readonly update$?: Subject<number>;
    readonly destroy$?: Subject<void>;
    label: string;
    scene?: Scene | SceneBase;
    static destroy(lifecycle: LifecycleProps): void;
    static update(lifecycle: LifecycleProps, deltaTime: number): void;
    destroy(): void;
    update(deltaTime: number): void;
}
//# sourceMappingURL=lifecycle.d.ts.map