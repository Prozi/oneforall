"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const lifecycle_1 = require("./lifecycle");
class Component extends lifecycle_1.Lifecycle {
    constructor(gameObject) {
        super();
        this.name = "Component";
        this.gameObject = gameObject;
        this.gameObject.addComponent(this);
    }
    destroy() {
        var _a, _b, _c, _d;
        (_b = (_a = this.gameObject).removeComponent) === null || _b === void 0 ? void 0 : _b.call(_a, this);
        (_d = (_c = this.gameObject.parent) === null || _c === void 0 ? void 0 : _c.removeChild) === null || _d === void 0 ? void 0 : _d.call(_c, this.gameObject);
        super.destroy();
    }
}
exports.Component = Component;
