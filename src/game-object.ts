import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { Lifecycle, LifecycleParent, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export interface TGameObject<TSprite = Animator, TBody = CircleBody>
  extends GameObject {
  body: TBody;
  sprite: TSprite;
  target?: Vector;
}

export class GameObject implements LifecycleProps {
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
  gameObject?: SceneBase | Scene | GameObject;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;

  /**
   * Each GameObject has children Lifecycle Objects.
   */
  children: LifecycleProps[] = [];

  /**
   * position x
   */
  x: number;

  /**
   * position y
   */
  y: number;

  constructor(label = 'GameObject', x = 0, y = 0) {
    this.label = label;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  /**
   * get root scene
   */
  get root(): SceneBase | Scene | undefined {
    let cursor = this.gameObject;
    while (cursor?.gameObject) {
      cursor = cursor.gameObject;
    }

    return cursor as SceneBase | Scene | undefined;
  }

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

  addChild(...children: LifecycleProps[]): void {
    const root = this.root;
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index === -1) {
        // add to root scene if exists
        root?.addChild(child);
        this.children.push(child);
        child.gameObject = this;
      }
    });
  }

  removeChild(...children: LifecycleProps[]): void {
    const root = this.root;
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        // remove from root scene if exists
        root?.removeChild(child);
        this.children.splice(index, 1);
        child.gameObject = null;
      }
    });
  }

  getChildOfType(type: string): LifecycleProps {
    return this.children.find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): LifecycleProps[] {
    return this.children.filter(({ label }) => label === type);
  }
}
