import { Body } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Application } from './application';
import { Resources } from './resources';
import { SceneBase, SceneOptions } from './scene-base';
export declare class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
    pixi: Application;
    resources: Resources;
    /**
     * When auto sort is set to false, it emits this subject.
     */
    readonly disableAutoSort$: Subject<void>;
    /**
     * When auto sort is set to false, it emits this subject.
     */
    readonly disableDebug$: Subject<void>;
    constructor(options?: SceneOptions);
    static getQueryParams(): Record<string, string>;
    init(options?: Partial<PIXI.ApplicationOptions>): Promise<void>;
    start(): void;
    stop(): void;
    destroy(): void;
    enableAutoSort(): void;
    disableAutoSort(): void;
    enableDebug(): void;
    disableDebug(): void;
    /**
     * add body font family to set font of pixi-stats
     */
    showFPS(style?: string): void;
}
//# sourceMappingURL=scene.d.ts.map