import { Body, System } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

export interface SceneOptions {
  /**
   * set name
   */
  label?: string;
  /**
   * show scene after creation
   */
  visible?: boolean;
  /**
   * enables zIndex (per-y) sort of sprites
   */
  autoSort?: boolean;
  /**
   * max size of group in collision tree
   */
  nodeMaxEntries?: number;
  /**
   * set to true to show pixi-stats
   * set to string to show and set style
   * set body font to set font of pixi-stats
   */
  showFPS?: boolean | string;
}

export class SceneBase<TBody extends Body = Body> implements LifecycleProps {
  /**
   * When Scene Object has children amount changed, it emits this subject.
   */
  readonly children$: Subject<void> = new Subject();

  /**
   * Parent GameObject is assigned at creation.
   * Scene Object has no Parent GameObject.
   */
  readonly gameObject = null;

  /**
   * When Lifecycle Object is updated, it emits this subject.
   * Along with updating his children, which in turn behave the same.
   */
  readonly update$: Subject<number> = new Subject();

  /**
   * When Lifecycle Object is destroyed, it emits and closes this subject.
   * Along with destroying his children, which in turn behave the same.
   */
  readonly destroy$: Subject<void> = new Subject();

  /**
   * Options are assigned at creation.
   */
  readonly options: SceneOptions;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;

  /**
   * Reference to Collision Detection System.
   */
  physics: System<TBody>;

  /**
   * Top Level Container.
   */
  stage: PIXI.Container;

  /**
   * Scene has children.
   */
  children: LifecycleProps[] = [];

  /**
   * Scene has last update unix time stored.
   */
  lastUpdate: number;

  /**
   * requestAnimationFrame reference.
   */
  animationFrame = 0;

  constructor(options: SceneOptions = {}) {
    this.options = options;
    this.label = this.options.label || 'Scene';
    this.physics = new System<TBody>(this.options.nodeMaxEntries);
    this.stage = new PIXI.Container();
    this.stage.label = 'Stage';
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
      const deltaTime = (now - this.lastUpdate) * 0.06;
      // 60 / 1000
      this.update(deltaTime);
      this.lastUpdate = now;

      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }

      this.animationFrame = requestAnimationFrame(frame);
    };

    this.animationFrame = requestAnimationFrame(frame);
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
      // (!) will also this.gameObject.removeComponent(component)
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
