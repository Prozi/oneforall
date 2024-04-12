import { Body, System } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export interface SceneOptions {
  label?: string;
  visible?: boolean;
  autoSort?: boolean;
  scale?: number;
  nodeMaxEntries?: number;
}

export class SceneBase<TBody extends Body = Body> implements LifecycleProps {
  readonly children$: Subject<void> = new Subject();
  readonly update$: Subject<number> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  label = 'Scene';
  animationFrame = 0;
  physics: System<TBody>;
  stage: PIXI.Container;
  children: LifecycleProps[] = [];
  lastUpdate: number;

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
    this.lastUpdate = Date.now();

    const frame = () => {
      const now = Date.now();
      const deltaTime = (now - (this.lastUpdate || now)) / 16.67;

      this.update(deltaTime);
      this.lastUpdate = now;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = requestAnimationFrame(frame);
    };

    frame();
  }

  update(deltaTime: number): void {
    this.physics.update();
    this.children.forEach((child) => {
      if (child instanceof Lifecycle) {
        child.update(deltaTime);
      }
    });

    Lifecycle.update(this, deltaTime);
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
    children.forEach((child) => {
      child.scene = this;

      if (child instanceof GameObject) {
        child.components.forEach((component) => {
          if (component instanceof PIXI.Container) {
            this.stage.addChild(component);
          }
        });
      } else if (child instanceof PIXI.Container) {
        this.stage.addChild(child);
      }

      const index = this.children.indexOf(child);
      if (index === -1) {
        this.children.push(child);
      }
    });

    this.children$.next();
  }

  removeChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      child.scene = null;

      if (child instanceof GameObject) {
        child.components.forEach((component) => {
          if (component instanceof PIXI.Container) {
            this.stage.removeChild(component);
          }
        });
      } else if (child instanceof PIXI.Container) {
        this.stage.removeChild(child);
      }

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
