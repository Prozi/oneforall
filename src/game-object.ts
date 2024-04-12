import { Subject } from 'rxjs/internal/Subject';
import { Vector } from 'detect-collisions';

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
  state?: StateMachine;
  target?: Vector;
}

export class GameObject extends Lifecycle {
  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label: string;

  /**
   * Each GameObject has children Lifecycle Objects.
   */
  components: LifecycleProps[] = [];

  /**
   * Lifecycle Object may be added to a Scene Object.
   */
  scene?: SceneBase | Scene;

  constructor(label = 'GameObject', x = 0, y = 0) {
    super();

    this.label = label;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  update(deltaTime: number): void {
    this.components.forEach((component: Lifecycle) => {
      component.update(deltaTime);
    });

    super.update(deltaTime);
  }

  destroy(): void {
    while (this.components.length) {
      const component = this.components.pop() as Lifecycle;
      // will also gameObject.removeComponent(component)
      component.destroy();
    }

    this.scene?.removeChild(this);

    super.destroy();
  }

  addComponent(component: LifecycleProps): boolean {
    const index = this.components.indexOf(component);
    if (index !== -1) {
      return false;
    }

    this.components.push(component);
    this.scene?.addChild(component);

    return true;
  }

  removeComponent(component: LifecycleProps): boolean {
    const index = this.components.indexOf(component);
    if (index === -1) {
      return false;
    }

    this.components.splice(index, 1);
    this.scene?.removeChild(component);

    return true;
  }

  getComponentOfType(type: string): LifecycleProps {
    return this.components.find(({ label }) => label === type);
  }

  getComponentsOfType(type: string): LifecycleProps[] {
    return this.components.filter(({ label }) => label === type);
  }
}
