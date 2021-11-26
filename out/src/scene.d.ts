import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs';
import { System } from 'detect-collisions';
import { Application } from './application';
import { GameObject } from './game-object';
import { Resources } from './resources';
import { Lifecycle } from './component';
export declare class Scene extends Lifecycle {
    readonly name: string;
    readonly children: Set<GameObject>;
    readonly children$: Subject<void>;
    pixi: Application;
    resouces: Resources;
    physics: System;
    scale: number;
    stage: PIXI.Container;
    destroy$: Subject<void>;
    animationFrame: number;
    constructor(options?: {
        name?: string;
        visible?: boolean;
        autoSize?: boolean;
        autoSort?: boolean;
        scale?: number;
    });
    stop(): void;
    start(): void;
    enableAutoSize(): void;
    enableAutoSort(): void;
    update(): void;
    destroy(): void;
    addChild(child: GameObject): void;
    removeChild(child: GameObject): void;
    getChildOfType(type: string): GameObject;
    getChildrenOfType(type: string): GameObject[];
}
//# sourceMappingURL=scene.d.ts.map