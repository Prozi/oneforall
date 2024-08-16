import { Lifecycle, LifecycleProps } from './lifecycle';

import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneSSR } from './scene-ssr';
import { Subject } from 'rxjs/internal/Subject';
import { Vector } from 'detect-collisions';

export interface TGameObject<TSprite = Animator, TBody = CircleBody>
  extends GameObject {
  body: TBody;
  sprite: TSprite;
  target?: Vector;
}

export type SceneType = SceneSSR | Scene;

export type GameObjectParent = SceneType | GameObject;

export const getRoot = (gameObject: GameObject): SceneType | undefined => {
  let root: GameObjectParent | undefined = gameObject;
  do {
    root = root.gameObject as SceneType | undefined;
  } while (root?.gameObject);

  return root as SceneType | undefined;
};

export class GameObject extends Lifecycle {
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

  constructor(label = 'GameObject', x = 0, y = 0) {
    super();
    this.label = label;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  /**
   * get parent scene if exists
   */
  get scene(): SceneType | undefined {
    return getRoot(this);
  }

  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number): void {
    this.children.forEach((child: Lifecycle) => {
      child.update(deltaTime);
    });
    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    while (this.children.length) {
      const child = this.children.pop() as Lifecycle;
      // (!) does also child.gameObject.removeChild(child)
      child.destroy();
    }
    Lifecycle.destroy(this);
  }

  recursive(child: LifecycleProps, callback: (deep: LifecycleProps) => void) {
    callback(child);
    if (child instanceof Lifecycle) {
      child.children.forEach((deep) => {
        this.recursive(deep, callback);
      });
    }
  }

  addChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      child.gameObject = this;
      const index = this.children.indexOf(child);
      if (index === -1) {
        this.children.push(child);
      }
    });
    // add pixi components
    this.scene?.stageAddChild(...children);
  }

  removeChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      child.gameObject = null;
      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    });
    // remove pixi components
    this.scene?.stageRemoveChild(...children);
  }

  getChildOfType(type: string): LifecycleProps {
    return this.children.find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): LifecycleProps[] {
    return this.children.filter(({ label }) => label === type);
  }
}
