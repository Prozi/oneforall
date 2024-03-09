import * as PIXI from "pixi.js";
import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";
import { Scene } from "./scene";
import { SceneBase } from "./scene-base";

export interface LifecycleProps {
  readonly name: string;

  update$?: Subject<void>;
  destroy$?: Subject<void>;

  update(): void;
  destroy(): void;
}

export class Lifecycle extends PIXI.Container implements LifecycleProps {
  readonly name: string = "Lifecycle";

  update$?: Subject<void> = new Subject();
  destroy$?: Subject<void> = new Subject();
  gameObject?: GameObject;
  scene?: Scene | SceneBase;

  destroy(): void {
    this.gameObject?.removeComponent(this);

    this.update$?.complete();
    this.destroy$?.next();
    this.destroy$?.complete();

    this.update$ = undefined;
    this.destroy$ = undefined;
    this.gameObject = undefined;
  }

  update(): void {
    this.update$.next();
  }
}
