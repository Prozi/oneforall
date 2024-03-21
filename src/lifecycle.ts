import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export interface LifecycleProps {
  readonly label: string;

  update$?: Subject<void>;
  destroy$?: Subject<void>;
  gameObject?: GameObject;

  update(): void;
  destroy(): void;
}

export class Lifecycle extends PIXI.Container implements LifecycleProps {
  readonly label: string = 'Lifecycle';

  update$?: Subject<void> = new Subject();
  destroy$?: Subject<void> = new Subject();
  gameObject?: GameObject;
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

  static update(lifecycle: LifecycleProps): void {
    lifecycle.update$?.next();
  }

  destroy(): void {
    Lifecycle.destroy(this);
  }

  update(): void {
    Lifecycle.update(this);
  }
}
