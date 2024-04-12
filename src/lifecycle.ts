import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export interface LifecycleProps {
  label: string;

  scene?: SceneBase | Scene;
  update$?: Subject<number>;
  destroy$?: Subject<void>;
  gameObject?: GameObject;

  update(deltaTime: number): void;
  destroy(): void;
}

export class Lifecycle extends PIXI.Container implements LifecycleProps {
  readonly gameObject?: GameObject;
  readonly update$?: Subject<number> = new Subject();
  readonly destroy$?: Subject<void> = new Subject();

  label = 'Lifecycle';
  scene?: Scene | SceneBase;

  static destroy(lifecycle: LifecycleProps): void {
    lifecycle.gameObject?.removeComponent(lifecycle as Lifecycle);

    lifecycle.update$?.complete();
    lifecycle.destroy$?.next();
    lifecycle.destroy$?.complete();

    lifecycle.update$ = undefined;
    lifecycle.destroy$ = undefined;
    lifecycle.gameObject = undefined;
  }

  static update(lifecycle: LifecycleProps, deltaTime: number): void {
    lifecycle.update$?.next(deltaTime);
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }

  update(deltaTime: number): void {
    Lifecycle.update(this, deltaTime);
  }
}
