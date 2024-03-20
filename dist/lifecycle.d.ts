import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export interface LifecycleProps {
    readonly name: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    update(): void;
    destroy(): void;
}
export declare class Lifecycle extends PIXI.Container implements LifecycleProps {
    readonly name: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    gameObject?: GameObject;
    scene?: Scene | SceneBase;
    destroy(): void;
    update(): void;
}
//# sourceMappingURL=lifecycle.d.ts.map