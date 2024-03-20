"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const lifecycle_1 = require("./lifecycle");
class Component extends lifecycle_1.Lifecycle {
    constructor(gameObject) {
        super();
        this.name = 'Component';
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
}
exports.Component = Component;
