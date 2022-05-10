import 'pixi-shim'
import * as PIXI from 'pixi.js-legacy'
import { Sprite } from './sprite'
import { GameObject } from './game-object'

describe('GIVEN Sprite', () => {
  it('THEN update propagates x/y changes', () => {
    const go = new GameObject()
    const sprite = new Sprite(go, PIXI.Texture.WHITE)

    go.x = 50
    go.update()

    expect(sprite.x).toBe(50)
  })

  it('THEN destroy works', () => {
    const go = new GameObject()
    const sprite = new Sprite(go, PIXI.Texture.WHITE)

    sprite.destroy()

    expect(go.components.length).toBe(0)
  })
})
