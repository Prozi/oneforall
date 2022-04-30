import * as PIXI from 'pixi.js';
export interface IStage {
    addChild: (child: PIXI.DisplayObject) => void;
    removeChild: (child: PIXI.DisplayObject) => void;
    children: PIXI.DisplayObject[];
    scale: PIXI.Point;
}
export declare class StageBase implements IStage {
    children: PIXI.DisplayObject[];
    scale: PIXI.Point;
    addChild(child: PIXI.DisplayObject): void;
    removeChild(child: PIXI.DisplayObject): void;
}
//# sourceMappingURL=stage-base.d.ts.map