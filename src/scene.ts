import * as PIXI from "pixi.js";
import { Body } from "detect-collisions";
import { takeUntil } from "rxjs/operators";
import { fromEvent } from "rxjs/internal/observable/fromEvent";
import { Inject } from "@jacekpietal/dependency-injection";
import { Application } from "./application";
import { Resources } from "./resources";
import { SceneBase, SceneOptions } from "./scene-base";

export class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
  @Inject(Application) pixi: Application;
  @Inject(Resources) resouces: Resources;

  stage: PIXI.Container = new PIXI.Container();

  constructor(options: SceneOptions = {}) {
    super(options);

    // 1 additonal layer
    this.stage.visible = options.visible || false;

    if (options.autoSize) {
      this.enableAutoSize();
    }

    if (options.autoSort) {
      this.enableAutoSort();
    }

    // real stage
    this.pixi.stage.addChild(this.stage);
  }

  start(): void {
    this.pixi.stage.scale.set(this.scale);
    this.pixi.start();

    super.start();
  }

  stop(): void {
    this.pixi.stop();

    super.stop();
  }

  destroy(): void {
    super.destroy();
    this.stage.parent.removeChild(this.stage);
    this.stage.destroy();
  }

  enableAutoSort(): void {
    this.update$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.stage.children.sort(
        (a: PIXI.DisplayObject, b: PIXI.DisplayObject) => a.y - b.y
      );
    });
  }

  enableAutoSize(): void {
    this.pixi.renderer.resize(innerWidth, innerHeight);

    fromEvent(window, "resize")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pixi.renderer.resize(innerWidth, innerHeight);
      });
  }
}
