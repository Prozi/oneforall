import { Body } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { merge } from 'rxjs/internal/observable/merge';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';

import { Inject } from '@jacekpietal/dependency-injection';

import { Application } from './application';
import { Resources } from './resources';
import { SceneBase, SceneOptions } from './scene-base';

export class Scene<TBody extends Body = Body> extends SceneBase<TBody> {
  @Inject(Application) pixi: Application;
  @Inject(Resources) resouces: Resources;

  options: SceneOptions;
  disableAutoSort$: Subject<void> = new Subject();

  constructor(options: SceneOptions = {}) {
    super();

    this.options = options;
    this.stage.visible = options.visible || false;
    this.pixi.stage.addChild(this.stage);

    if (options.autoSort) {
      this.enableAutoSort();
    }
  }

  async init(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    await this.pixi.init(options);

    document.body.appendChild(this.pixi.canvas);
  }

  start(): void {
    this.pixi.start();
    super.start();
  }

  stop(): void {
    this.pixi.stop?.();
    super.stop();
  }

  destroy(): void {
    super.destroy();
    this.pixi.stage.removeChild(this.stage);
  }

  disableAutoSort(): void {
    this.disableAutoSort$.next();
  }

  enableAutoSort(): void {
    this.update$
      .pipe(takeUntil(merge(this.destroy$, this.disableAutoSort$)))
      .subscribe(() => {
        this.stage.children.sort(
          (bodyA: PIXI.Container, bodyB: PIXI.Container) => bodyA.y - bodyB.y
        );
      });
  }
}
