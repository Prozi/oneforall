import { GameObject } from './game-object';
export class Prefab extends GameObject {
    constructor(name = 'GameObject', createFunction) {
        super(name, 0, 0);
        this.createFunction = createFunction;
    }
    async instantiate() {
        const gameObject = new GameObject(this.name, this.x, this.y);
        await this.createFunction(gameObject);
        return gameObject;
    }
}
