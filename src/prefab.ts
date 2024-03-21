import { GameObject } from './game-object';

export class Prefab extends GameObject {
  private createFunction: (prefab: GameObject) => Promise<void>;

  constructor(
    label = 'GameObject',
    createFunction: (prefab: GameObject) => Promise<void>
  ) {
    super(label, 0, 0);

    this.createFunction = createFunction;
  }

  async instantiate(): Promise<GameObject> {
    const gameObject = new GameObject(this.label, this.x, this.y);

    await this.createFunction(gameObject);

    return gameObject;
  }
}
