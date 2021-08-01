import { GameObject } from './game-object';
export class Prefab extends GameObject {
    constructor(name = 'GameObject', createFunction) {
        super(name, 0, 0);
        this.createFunction = createFunction;
    }
    instantiate() {
        const gameObject = new GameObject(this.name, this.x, this.y);
        this.createFunction(gameObject);
        return gameObject;
    }
}
