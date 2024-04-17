import { Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';

import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
import { StateMachine } from './state-machine';

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

  /**
   * Lifecycle Object may be added to a Scene Object.
   */
  scene?: SceneBase | Scene;

  constructor(label = 'GameObject', x = 0, y = 0) {
    this.label = label;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  update(deltaTime: number): void {
    this.children.forEach((component: Lifecycle) => {
      component.update(deltaTime);
    });

    Lifecycle.update(this, deltaTime);
  }

  destroy(): void {
    while (this.children.length) {
      const child = this.children.pop() as Lifecycle;
      // (!) does also child.gameObject.removeChild(child)
      child.destroy();
    }

    this.scene?.removeChild(this);

    Lifecycle.destroy(this);
  }

  addChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index !== -1) {
        return;
      }

      this.children.push(child);
      this.scene?.addChild(child);
    });
  }

  removeChild(...children: LifecycleProps[]): void {
    children.forEach((child) => {
      const index = this.children.indexOf(child);
      if (index === -1) {
        return;
      }

      this.children.splice(index, 1);
      this.scene?.removeChild(child);
    });
  }

  getChildOfType(type: string): LifecycleProps {
    return this.children.find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): LifecycleProps[] {
    return this.children.filter(({ label }) => label === type);
  }
}
