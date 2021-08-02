import { Component } from './component'
import { GameObject } from './game-object'

describe('GIVEN GameObject', () => {
  it('THEN you can add component', () => {
    const go = new GameObject()
    const component = new Component(go)

    expect(go.components.size).toBe(1)
  })

  it('THEN update propagates to components', () => {
    const go = new GameObject()
    const component1 = new Component(go)
    const component2 = new Component(go)

    jest.spyOn(component1, 'update')
    jest.spyOn(component2, 'update')

    go.update()

    expect(component1.update).toHaveBeenCalled()
    expect(component2.update).toHaveBeenCalled()
  })

  it('THEN you can remove component', () => {
    const go = new GameObject()
    const component = new Component(go)

    go.removeComponent(component)

    expect(go.components.size).toBe(0)
  })

  it('THEN destroy removes component', () => {
    const go = new GameObject()
    const component = new Component(go)

    component.destroy()

    expect(go.components.size).toBe(0)
  })

  it('THEN you can get component by name', () => {
    const go = new GameObject()
    const component = new Component(go)

    expect(go.getComponentOfType('Component')).toBeTruthy()
  })

  it('THEN you can get components by name', () => {
    const go = new GameObject()
    const component = new Component(go)

    expect(go.getComponentsOfType('Component').length).toBe(1)
  })
})
