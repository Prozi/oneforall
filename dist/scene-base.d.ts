import { Body, System } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { LifecycleProps } from './lifecycle';
export interface SceneOptions {
    /**
     * set name
     */
    label?: string;
    /**
     * show scene after creation
     */
    visible?: boolean;
    /**
     * enables zIndex (per-y) sort of sprites
     */
    autoSort?: boolean;
    /**
     * max size of group in collision tree
     */
    nodeMaxEntries?: number;
    /**
     * set to true to show pixi-stats
     * set to string to show and set style
     * set body font to set font of pixi-stats
     */
    showFPS?: boolean | string;
}
export declare class SceneBase<TBody extends Body = Body> implements LifecycleProps {
    /**
     * When Scene Object has children amount changed, it emits this subject.
     */
    readonly children$: Subject<void>;
    /**
     * Parent GameObject is assigned at creation.
     * Scene Object has no Parent GameObject.
     */
    readonly gameObject: any;
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    readonly update$: Subject<number>;
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    readonly destroy$: Subject<void>;
    /**
     * Options are assigned at creation.
     */
    readonly options: SceneOptions;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * Reference to Collision Detection System.
     */
    physics: System<TBody>;
    /**
     * Top Level Container.
     */
    stage: PIXI.Container;
    /**
     * Scene has children.
     */
    children: LifecycleProps[];
    /**
     * Scene has last update unix time stored.
     */
    lastUpdate: number;
    /**
     * requestAnimationFrame reference.
     */
    animationFrame: number;
    constructor(options?: SceneOptions);
    init(_options?: Record<string, any>): Promise<void>;
    stop(): void;
    start(): void;
    update(deltaTime: number): void;
    destroy(): void;
    addChild(...children: LifecycleProps[]): void;
    removeChild(...children: LifecycleProps[]): void;
    getChildOfType(type: string): LifecycleProps;
    getChildrenOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=scene-base.d.ts.map