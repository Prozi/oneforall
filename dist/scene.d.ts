import * as PIXI from "pixi.js";
import { Application } from "./application";
import { Resources } from "./resources";
import { SceneBase, SceneOptions } from "./scene-base";
export declare class Scene extends SceneBase {
    pixi: Application;
    resouces: Resources;
    stage: PIXI.Container;
    constructor(options?: SceneOptions);
    start(): void;
    stop(): void;
    destroy(): void;
    enableAutoSort(): void;
    enableAutoSize(): void;
}
//# sourceMappingURL=scene.d.ts.map