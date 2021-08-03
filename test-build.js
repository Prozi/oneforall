import 'pixi-shim'
import { GameObject } from './dist/index.js'
import { Component } from './dist/component.js';

const go = new GameObject();
const component = new Component(go);

console.info(go);
console.info(component);
