import * as PIXI from 'pixi.js';

import { Body, System } from 'detect-collisions';
import { GameObject, GameObjectParent } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

import { Subject } from 'rxjs/internal/Subject';

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

/**
 * base scene for server side rendering
 */
export class SceneSSR<TBody extends Body = Body> extends GameObject {
  /**
   * When Scene Object has children amount changed, it emits this subject.
   */
  readonly children$: Subject<Lifecycle> = new Subject();

  /**
   * Options are assigned at creation.
   */
  readonly options: SceneOptions;

  /**
   * Scene doesn't have parent gameObject
   */
  gameObject: GameObjectParent = undefined;

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

  /**
   * Scene doesn't have parent scene
   */
  get scene(): undefined {
    return undefined;
  }

  async init(_options?: Partial<PIXI.ApplicationOptions>): Promise<boolean> {
    return true;
  }

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

  stageAddChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.addChild(deep);
        }
      });
    });
  }

  addChild(...children: LifecycleProps[]): void {
    super.addChild(...children);
    this.stageAddChild(...children);
  }

  stageRemoveChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.removeChild(deep);
        }
      });
    });
  }

  removeChild(...children: LifecycleProps[]): void {
    super.removeChild(...children);
    this.stageRemoveChild(...children);
  }

  getChildOfType(type: string): LifecycleProps {
    return this.children.find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): LifecycleProps[] {
    return this.children.filter(({ label }) => label === type);
  }
}
