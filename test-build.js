require("pixi-shim")

const { GameObject, Component } = require("./dist/index.js")

const gameObject = new GameObject()
const component = new Component(gameObject)

console.info({ gameObject: !!gameObject, component: !!component })
