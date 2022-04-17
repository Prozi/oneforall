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
const rxjs_1 = require("rxjs");
const lifecycle_1 = require("./lifecycle");
class GameObject {
    constructor(name = 'GameObject', x = 0, y = 0) {
        this.update$ = new rxjs_1.Subject();
        this.destroy$ = new rxjs_1.Subject();
        this.components = new Set();
        this.components$ = new rxjs_1.Subject();
        this.name = name;
        this.x = x;
        this.y = y;
    }
    static instantiate(prefab) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prefab.instantiate();
        });
    }
    update() {
        Array.from(this.components.values()).forEach((component) => component.update());
        lifecycle_1.Lifecycle.update(this);
    }
    destroy() {
        Array.from(this.components.values()).forEach((component) => this.removeComponent(component));
        lifecycle_1.Lifecycle.destroy(this);
    }
    addComponent(component, key = component.key || '') {
        if (this.components.has(component)) {
            return;
        }
        this.components.add(component);
        this.components$.next();
        if (key) {
            component.key = key;
            this[key] = component;
        }
        return component;
    }
    removeComponent(component, key = component.key || '') {
        if (!this.components.has(component)) {
            return;
        }
        if (key && this[key]) {
            this[key] = null;
        }
        this.components.delete(component);
        this.components$.next();
    }
    getComponentOfType(type) {
        return Array.from(this.components.values()).find(({ name }) => name === type);
    }
    getComponentsOfType(type) {
        return Array.from(this.components.values()).filter(({ name }) => name === type);
    }
}
exports.GameObject = GameObject;
