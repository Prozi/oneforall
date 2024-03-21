import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export interface LifecycleProps {
    readonly label: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    gameObject?: GameObject;
    update(): void;
    destroy(): void;
}
export declare class Lifecycle extends PIXI.Container implements LifecycleProps {
    readonly label: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    gameObject?: GameObject;
    scene?: Scene | SceneBase;
    static destroy(lifecycle: LifecycleProps): void;
    static update(lifecycle: LifecycleProps): void;
    destroy(): void;
    update(): void;
}
//# sourceMappingURL=lifecycle.d.ts.map