import 'pixi-shim'
import { GameObject } from './esnext/index.js'
import { Component } from './esnext/component.js';

const go = new GameObject();
const component = new Component(go);

console.info(go);
console.info(component);
