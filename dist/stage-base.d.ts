import * as PIXI from 'pixi.js';
export type PIXIDisplayObject = PIXI.Container;
export interface StageProps {
    children: PIXIDisplayObject[];
    scale: PIXI.Point;
    addChild(child: PIXIDisplayObject): void;
    removeChild(child: PIXIDisplayObject): void;
}
export declare class StageBase implements StageProps {
    children: PIXIDisplayObject[];
    scale: PIXI.Point;
    addChild(child: PIXIDisplayObject): void;
    removeChild(child: PIXIDisplayObject): void;
}
//# sourceMappingURL=stage-base.d.ts.map