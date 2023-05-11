import { Subject } from 'rxjs/internal/Subject';
import { System, Body } from 'detect-collisions';
import { GameObject } from './game-object';
import { Lifecycle } from './lifecycle';
import { IStage } from './stage-base';
export interface SceneOptions {
    name?: string;
    visible?: boolean;
    autoSize?: boolean;
    autoSort?: boolean;
    scale?: number;
    nodeMaxEntries?: number;
}
export declare class SceneBase<TBody extends Body = Body> extends Lifecycle {
    readonly name: string;
    children$: Subject<void>;
    children: GameObject[];
    stage: IStage;
    physics: System<TBody>;
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