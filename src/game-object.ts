import { Subject } from "rxjs/internal/Subject";
import { Scene } from "./scene";
import { ILifecycle, Lifecycle } from "./lifecycle";
import { Prefab } from "./prefab";
import { SceneBase } from "./scene-base";

export class GameObject extends Lifecycle {
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  components: ILifecycle[] = [];
  parent?: Scene | SceneBase;
  name: string;
  x: number;
  y: number;

  constructor(name = "GameObject", x = 0, y = 0) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
  }

  static async instantiate(prefab: Prefab): Promise<GameObject> {
    return prefab.instantiate();
  }

  update(): void {
    this.components.forEach((component: ILifecycle) => {
      component.update();
    });

    super.update();
  }

  destroy(): void {
    this.components.forEach((component: ILifecycle) => {
      component.destroy();
    });

    this.components = undefined;
    this.parent?.removeChild(this);
    super.destroy();
  }

  addComponent(component: ILifecycle): boolean {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      return false;
    }

    this.components.push(component);

    return true;
  }

  removeComponent(component: ILifecycle): boolean {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
    }

    return index !== -1;
  }

  getComponentOfType(type: string): ILifecycle {
    return this.components.find(({ name }) => name === type);
  }

  getComponentsOfType(type: string): ILifecycle[] {
    return this.components.filter(({ name }) => name === type);
  }
}
