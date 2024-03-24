import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { System, Body } from 'detect-collisions';
import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Animator } from './animator';

export interface SceneOptions {
  label?: string;
  visible?: boolean;
  autoSort?: boolean;
  scale?: number;
  nodeMaxEntries?: number;
}

export class SceneBase<TBody extends Body = Body> implements LifecycleProps {
  label = 'Scene';
  animationFrame = 0;
  physics: System<TBody>;
  stage: PIXI.Container;
  children: LifecycleProps[] = [];
  readonly children$: Subject<void> = new Subject();
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(options: SceneOptions = {}) {
    this.stage = new PIXI.Container();
    this.stage.label = 'Stage';
    this.physics = new System<TBody>(options.nodeMaxEntries);
  }

  // tslint:disable-next-line
  async init(_options?: Record<string, any>): Promise<void> {}

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  start(): void {
    const frame = () => {
      this.update();

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      this.animationFrame = requestAnimationFrame(frame);
    };

    frame();
  }

  update(): void {
    this.physics.update();
    this.children.forEach((child) => {
      if (child instanceof Lifecycle) {
        child.update();
      }
    });

    Lifecycle.update(this);
  }

  destroy(): void {
    this.stop();

    while (this.children.length) {
      const child = this.children.pop();
      // will also gameObject.removeComponent(component)
      child.destroy();
    }

    this.children$.complete();

    Lifecycle.destroy(this);
  }

  addChild(...children: LifecycleProps[]): void {
    children.forEach((child: LifecycleProps & { sprite?: PIXI.Container }) => {
      if (child.sprite instanceof Lifecycle) {
        this.addChild(child.sprite);
      } else if (child.sprite instanceof PIXI.Container) {
        this.stage.addChild(child.sprite);
      } else if (child instanceof PIXI.Container) {
        this.stage.addChild(child);
      }

      child.scene = this;

      const index = this.children.indexOf(child);
      if (index === -1) {
        this.children.push(child);
      }
    });

    this.children$.next();
  }

  removeChild(...children: LifecycleProps[]): void {
    children.forEach((child: LifecycleProps & { sprite?: PIXI.Container }) => {
      if (child.sprite instanceof PIXI.Container) {
        this.stage.removeChild(child.sprite);
      } else if (child instanceof PIXI.Container) {
        this.stage.removeChild(child);
      }

      child.scene = null;

      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    });

    this.children$.next();
  }

  getChildOfType(type: string): LifecycleProps {
    return this.children.find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): LifecycleProps[] {
    return this.children.filter(({ label }) => label === type);
  }
}
