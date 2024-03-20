import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { System, Body } from 'detect-collisions';
import { Lifecycle } from './lifecycle';
import { StageProps } from './stage-base';
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
    stage: StageProps;
    physics: System<TBody>;
    destroy$: Subject<void>;
    animationFrame: number;
    constructor(options?: SceneOptions);
    stop(): void;
    start(): void;
    update(): void;
    destroy(): void;
    addChild(...children: PIXI.Container[]): PIXI.Container;
    removeChild(...children: PIXI.Container[]): PIXI.Container;
    getChildOfType(type: string): PIXI.Container;
    getChildrenOfType(type: string): PIXI.Container[];
}
//# sourceMappingURL=scene-base.d.ts.map