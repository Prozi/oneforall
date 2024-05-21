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
  /**
   * set to true to enable debug bounding boxes
   */
  debug?: boolean;
}

export class SceneBase<TBody extends Body = Body> extends GameObject {
  /**
   * When Scene Object has children amount changed, it emits this subject.
   */
  readonly children$: Subject<void> = new Subject();

  /**
   * Options are assigned at creation.
   */
  readonly options: SceneOptions;

  /**
   * Reference to Collision Detection System.
   */
  physics: System<TBody>;

  /**
   * Top Level Container.
   */
  stage: PIXI.Container;

  /**
   * Scene has last update unix time stored.
   */
  lastUpdate: number;

  /**
   * requestAnimationFrame reference.
   */
  animationFrame = 0;

  constructor(options: SceneOptions = {}) {
    super(options.label || 'Scene');

    this.options = options;
    this.physics = new System<TBody>(options.nodeMaxEntries);
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
    super.update(deltaTime);
    this.physics.update();
  }

  destroy(): void {
    this.stop();
    super.destroy();
    this.children$.complete();
  }

  addChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index === -1) {
        // add to root scene
        if (child instanceof PIXI.Container) {
          this.stage.addChild(child);
        }
        this.children.push(child);
        child.gameObject = this;
      }
    });

    this.children$.next();
  }

  removeChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        // remove from root scene
        if (child instanceof PIXI.Container) {
          child.gameObject.removeChild(child);
        }
        this.children.splice(index, 1);
        child.gameObject = null;
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
