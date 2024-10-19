import { Container } from 'pixi.js';
import { Body, System } from 'detect-collisions';
import { GameObject, GameObjectParent } from './game-object';
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
export declare class SceneSSR<TBody extends Body = Body> extends GameObject {
  /**
   * When Scene Object has children amount changed, it emits this subject.
   */
  readonly children$: Subject<Lifecycle>;
  /**
   * Options are assigned at creation.
   */
  readonly options: SceneOptions;
  /**
   * Scene doesn't have parent gameObject
   */
  gameObject: GameObjectParent;
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
  animationFrame: number;
  constructor(options?: SceneOptions);
  /**
   * Scene doesn't have parent scene
   */
  get scene(): undefined;
  init(_options?: Partial<Record<string, any>>): Promise<boolean>;
  stop(): void;
  start(): void;
  update(deltaTime: number): void;
  destroy(): void;
  addChild(...children: LifecycleProps[]): void;
  stageAddChild(...children: LifecycleProps[]): void;
  stageRemoveChild(...children: LifecycleProps[]): void;
  removeChild(...children: LifecycleProps[]): void;
  getChildOfType(type: string): LifecycleProps;
  getChildrenOfType(type: string): LifecycleProps[];
  createStage(): Container;
}
//# sourceMappingURL=scene-ssr.d.ts.map
