import 'pixi-shim'
import { Container } from './container'
import { GameObject } from './game-object'

describe('GIVEN Container', () => {
  it('THEN update propagates x/y changes', () => {
    const go = new GameObject()
    const container = new Container(go)

    go.x = 50
    go.update()

    expect(container.x).toBe(50)
  })

  it('THEN destroy works', () => {
    const go = new GameObject()
    const sprite = new Container(go)

    sprite.destroy()

    expect(go.components.length).toBe(0)
  })
})
