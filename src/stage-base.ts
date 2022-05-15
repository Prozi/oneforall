import * as PIXI from "pixi.js";

export interface IStage {
  children: PIXI.DisplayObject[];
  scale: PIXI.Point;
  addChild(child: PIXI.DisplayObject): void;
  removeChild(child: PIXI.DisplayObject): void;
}

export class StageBase implements IStage {
  children: PIXI.DisplayObject[] = [];
  scale: PIXI.Point = new PIXI.Point(1, 1);

  addChild(child: PIXI.DisplayObject) {
    this.children.push(child);
  }

  removeChild(child: PIXI.DisplayObject) {
    this.children.splice(this.children.indexOf(child), 1);
  }
}
