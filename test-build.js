require('pixi-shim')

const { GameObject, Component } = require('./dist/index.js')

const go = new GameObject()
const component = new Component(go)

console.info(go)
console.info(component)
