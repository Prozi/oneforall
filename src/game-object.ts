import * as PIXI from "pixi.js";
import { Subject } from "rxjs/internal/Subject";
import { Scene } from "./scene";
import { Lifecycle } from "./lifecycle";
import { Prefab } from "./prefab";
import { SceneBase } from "./scene-base";

export class GameObject extends Lifecycle {
  readonly update$: Subject<void> = new Subject();
  readonly destroy$: Subject<void> = new Subject();

  components: Lifecycle[] = [];
  scene?: Scene | SceneBase;
  name: string;

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
    this.components?.forEach((component: Lifecycle) => {
      component.update();
    });

    super.update();
  }

  destroy(): void {
    this.components?.forEach((component: Lifecycle) => {
      component.destroy();
    });

    this.components = undefined;
    super.destroy();
  }

  addComponent(component: Lifecycle): boolean {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      return false;
    }

    this.components.push(component);
    this.scene?.addChild(component);

    return true;
  }

  removeComponent(component: Lifecycle): boolean {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
      this.scene?.removeChild(component);
    }

    return index !== -1;
  }

  getComponentOfType(type: string): Lifecycle {
    return this.components.find(({ name }) => name === type);
  }

  getComponentsOfType(type: string): Lifecycle[] {
    return this.components.filter(({ name }) => name === type);
  }
}
