"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prefab = void 0;
const game_object_1 = require("./game-object");
class Prefab extends game_object_1.GameObject {
    constructor(label = 'GameObject', createFunction) {
        super(label, 0, 0);
        this.createFunction = createFunction;
    }
    async instantiate() {
        const gameObject = new game_object_1.GameObject(this.label, this.x, this.y);
        await this.createFunction(gameObject);
        return gameObject;
    }
}
exports.Prefab = Prefab;
