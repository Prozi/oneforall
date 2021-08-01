import { GameObject } from './game-object'

export class Prefab extends GameObject {
  private createFunction: (prefab: GameObject) => void

  constructor(
    name: string = 'GameObject',
    createFunction: (prefab: GameObject) => void
  ) {
    super(name, 0, 0)

    this.createFunction = createFunction
  }

  instantiate(): GameObject {
    const gameObject = new GameObject(this.name, this.x, this.y)

    this.createFunction(gameObject)

    return gameObject
  }
}
