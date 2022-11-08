import * as PIXI from "pixi.js";
export interface IStage {
    children: PIXI.DisplayObject[];
    scale: PIXI.Point;
    addChild(child: PIXI.DisplayObject): void;
    removeChild(child: PIXI.DisplayObject): void;
}
export declare class StageBase implements IStage {
    children: PIXI.DisplayObject[];
    scale: PIXI.Point;
    addChild(child: PIXI.DisplayObject): void;
    removeChild(child: PIXI.DisplayObject): void;
}
//# sourceMappingURL=stage-base.d.ts.map