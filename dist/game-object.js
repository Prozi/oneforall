"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const lifecycle_1 = require("./lifecycle");
class GameObject extends lifecycle_1.Lifecycle {
    constructor(name = 'GameObject', x = 0, y = 0) {
        super();
        this.update$ = new Subject_1.Subject();
        this.destroy$ = new Subject_1.Subject();
        this.components = [];
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static instantiate(prefab) {
        return __awaiter(this, void 0, void 0, function* () {
            return prefab.instantiate();
        });
    }
    update() {
        var _a;
        (_a = this.components) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
            component.update();
        });
        super.update();
    }
    destroy() {
        var _a, _b;
        (_a = this.components) === null || _a === void 0 ? void 0 : _a.forEach((component) => {
            component.destroy();
        });
        this.components = undefined;
        (_b = this.parent) === null || _b === void 0 ? void 0 : _b.removeChild(this);
        super.destroy();
    }
    addComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            return false;
        }
        this.components.push(component);
        return true;
    }
    removeComponent(component) {
        const index = this.components.indexOf(component);
        if (index !== -1) {
            this.components.splice(index, 1);
        }
        return index !== -1;
    }
    getComponentOfType(type) {
        return this.components.find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        return this.components.filter(({ name }) => name === type);
    }
}
exports.GameObject = GameObject;
