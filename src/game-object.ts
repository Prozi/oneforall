import { Subject } from 'rxjs/internal/Subject';

import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';

export class GameObject extends Lifecycle {
  label: string;
  components: LifecycleProps[] = [];
  scene?: Scene | SceneBase;

  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  constructor(label = 'GameObject', x = 0, y = 0) {
    super();

    this.label = label;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  update(): void {
    this.components?.forEach((component: Lifecycle) => {
      component.update();
    });

    super.update();
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
