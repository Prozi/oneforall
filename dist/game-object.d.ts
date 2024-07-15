import { Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneSSR } from './scene-ssr';
export interface TGameObject<TSprite = Animator, TBody = CircleBody>
  extends GameObject {
  body: TBody;
  sprite: TSprite;
  target?: Vector;
}
export type SceneType = SceneSSR | Scene;
export type GameObjectParent = SceneType | GameObject;
export declare const getRoot: (gameObject: GameObject) => SceneType | undefined;
export declare class GameObject extends Lifecycle {
  /**
   * When Lifecycle Object is updated, it emits this subject.
   * Along with updating his children, which in turn behave the same.
   */
  readonly update$: Subject<number>;
  /**
   * When Lifecycle Object is destroyed, it emits and closes this subject.
   * Along with destroying his children, which in turn behave the same.
   */
  readonly destroy$: Subject<void>;
  /**
   * Lifecycle Object may be added to a Scene Object.
   */
  gameObject?: GameObjectParent;
  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;
  /**
   * position x
   */
  x: number;
  /**
   * position y
   */
  y: number;
  constructor(label?: string, x?: number, y?: number);
  static instantiate(prefab: Prefab): Promise<GameObject>;
  /**
   * get parent scene if exists
   */
  get scene(): SceneType | undefined;
  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number): void;
  destroy(): void;
  recursive(
    child: LifecycleProps,
    callback: (deep: LifecycleProps) => void
  ): void;
  addChild(...children: LifecycleProps[]): void;
  removeChild(...children: LifecycleProps[]): void;
  getChildOfType(type: string): LifecycleProps;
  getChildrenOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=game-object.d.ts.map
