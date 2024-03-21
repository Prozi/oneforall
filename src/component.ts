import { GameObject } from './game-object';
import { Lifecycle } from './lifecycle';

export class Component extends Lifecycle {
  readonly label: string = 'Component';
  readonly gameObject: GameObject;

  constructor(gameObject: GameObject) {
    super();

    this.gameObject = gameObject;
    this.gameObject.addComponent(this);
  }
}
