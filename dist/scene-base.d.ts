import { Body, System } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { LifecycleProps } from './lifecycle';
export interface SceneOptions {
    label?: string;
    visible?: boolean;
    autoSort?: boolean;
    scale?: number;
    nodeMaxEntries?: number;
}
export declare class SceneBase<TBody extends Body = Body> implements LifecycleProps {
    label: string;
    animationFrame: number;
    physics: System<TBody>;
    stage: PIXI.Container;
    children: LifecycleProps[];
    readonly children$: Subject<void>;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(options?: SceneOptions);
    init(_options?: Record<string, any>): Promise<void>;
    stop(): void;
    start(): void;
    update(): void;
    destroy(): void;
    addChild(...children: LifecycleProps[]): void;
    removeChild(...children: LifecycleProps[]): void;
    getChildOfType(type: string): LifecycleProps;
    getChildrenOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=scene-base.d.ts.map