import { Subject } from 'rxjs';
import { System } from 'detect-collisions';
import { GameObject } from './game-object';
import { Lifecycle } from './component';
export declare type SceneOptions = {
    name?: string;
    visible?: boolean;
    autoSize?: boolean;
    autoSort?: boolean;
    scale?: number;
};
export declare class SceneBase extends Lifecycle {
    readonly name: string;
    readonly children: Set<GameObject>;
    readonly children$: Subject<void>;
    stage: any;
    physics: System;
    scale: number;
    destroy$: Subject<void>;
    animationFrame: number;
    constructor(options?: SceneOptions);
    stop(): void;
    start(): void;
    update(): void;
    destroy(): void;
    addChild(child: GameObject): void;
    removeChild(child: GameObject): void;
    getChildOfType(type: string): GameObject;
    getChildrenOfType(type: string): GameObject[];
}
//# sourceMappingURL=scene-base.d.ts.map