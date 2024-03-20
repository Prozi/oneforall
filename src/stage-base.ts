import * as PIXI from 'pixi.js';

export type PIXIDisplayObject = PIXI.Container;

export interface StageProps {
  children: PIXIDisplayObject[];
  scale: PIXI.Point;
  addChild(child: PIXIDisplayObject): void;
  removeChild(child: PIXIDisplayObject): void;
}

export class StageBase implements StageProps {
  children: PIXIDisplayObject[] = [];
  scale: PIXI.Point = new PIXI.Point(1, 1);

  addChild(child: PIXIDisplayObject) {
    this.children.push(child);
  }

  removeChild(child: PIXIDisplayObject) {
    this.children.splice(this.children.indexOf(child), 1);
  }
}
