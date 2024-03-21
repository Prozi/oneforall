import { Subject } from 'rxjs/internal/Subject';
import { Scene } from './scene';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { SceneBase } from './scene-base';

export class GameObject extends Lifecycle {
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  components: LifecycleProps[] = [];
  scene?: Scene | SceneBase;
  label: string;

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
    this.scene?.addChild(component as Lifecycle);

    return true;
  }

  removeComponent(component: LifecycleProps): boolean {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
      // scene.removeChild(component)
      this.scene?.removeChild(component as Lifecycle);
    }

    return index !== -1;
  }

  getComponentOfType(type: string): LifecycleProps {
    return this.components.find(({ label }) => label === type);
  }

  getComponentsOfType(type: string): LifecycleProps[] {
    return this.components.filter(({ label }) => label === type);
  }
}
