import { Body } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Application } from './application';
import { Resources } from './resources';
import { SceneBase, SceneOptions } from './scene-base';
export declare class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
    pixi: Application;
    resouces: Resources;
    options: SceneOptions;
    disableAutoSort$: Subject<void>;
    constructor(options?: SceneOptions);
    init(options?: Partial<PIXI.ApplicationOptions>): Promise<void>;
    start(): void;
    stop(): void;
    destroy(): void;
    disableAutoSort(): void;
    enableAutoSort(): void;
}
//# sourceMappingURL=scene.d.ts.map