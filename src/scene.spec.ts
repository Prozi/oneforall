import 'pixi-shim'
import 'pixi.js-legacy'
import { GameObject } from './game-object'
import { Scene } from './scene'

describe('GIVEN Scene', () => {
  it('THEN it works', () => {
    const scene = new Scene()

    expect(scene).toBeTruthy()
  })

  it('THEN it can have children', () => {
    const scene = new Scene({
      name: 'MyScene1',
      scale: 2,
      visible: true
    })
    scene.addChild(new GameObject())
    scene.addChild(new GameObject())
    scene.addChild(new GameObject())

    expect(scene.children.size).toBe(3)
  })
})
