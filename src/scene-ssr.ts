import { Container } from 'pixi.js';

import { Body, System } from 'detect-collisions';
import { GameObject, GameObjectParent, TGameObject } from './game-object';
import { Lifecycle, LifecycleProps } from './lifecycle';

import { Subject } from 'rxjs/internal/Subject';

/**
 * params for debug type
 */
export interface DebugStroke {
  color: number;
  width: number;
  alpha: number;
}

/**
 * possible options for scene constructor
 */
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
  debug?:
    | boolean
    | {
        /**
         * optional modify debug stroke
         */
        debugStroke?: DebugStroke;

        /**
         * optional modify debug bvh stroke
         */
        debugBVHStroke?: DebugStroke;
      };
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
  stage: Container;

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
    this.stage = this.createStage();

    const nameKey = 'label' in this.stage ? 'label' : 'name';

    this.stage[nameKey] = 'SceneStage';
  }

  /**
   * Scene doesn't have parent scene
   */
  get scene(): undefined {
    return undefined;
  }

  async init(_options?: Partial<Record<string, any>>): Promise<boolean> {
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

  addChild(...children: LifecycleProps[]): void {
    super.addChild(...children);
    this.stageAddChild(...children);

    children.forEach(({ body }: TGameObject<any, TBody>) => {
      if (body) {
        this.physics.insert(body);
      }
    });
  }

  stageAddChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof Container) {
          this.stage.addChild(deep);
        }
      });
    });
  }

  stageRemoveChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof Container) {
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

  createStage(): Container {
    return new Container();
  }
}
