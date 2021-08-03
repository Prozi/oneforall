import { Result } from 'detect-collisions'
import { Physics, IBody } from './physics'

describe('GIVEN Physics', () => {
  it('THEN it can be created', () => {
    const system = new Physics()

    expect(system).toBeTruthy()
  })

  it('THEN createPolygon works', () => {
    const system = new Physics()

    expect(system.createPolygon(0, 0, [])).toBeTruthy()
  })

  it('THEN createCircle works', () => {
    const system = new Physics()

    expect(system.createCircle(0, 0, 50)).toBeTruthy()
  })

  it('THEN remove works', () => {
    const system = new Physics()
    const body = system.createCircle(0, 0, 50)
    const removeBody = () => system.remove(body)

    expect(removeBody).not.toThrow()
  })

  it('THEN detectCollisions works', () => {
    const system = new Physics()
    const body1 = system.createCircle(30, 30, 50)
    const body2 = system.createCircle(20, 20, 50)

    system.update(false)

    expect(system.detectCollisions(body1).length).toBe(1)
  })

  it('THEN detectCollisions ignores bodies with isTrigger', () => {
    const system = new Physics()
    const body1 = system.createCircle(30, 30, 50)
    const body2 = system.createCircle(20, 20, 50) as IBody

    system.update()
    body2.isTrigger = true

    expect(system.detectCollisions(body1).length).toBe(0)
  })

  it('THEN pushBack works', () => {
    const system = new Physics()
    const body1 = system.createCircle(30, 30, 50)
    const body2 = system.createCircle(20, 20, 50)

    system.update()
    system.detectCollisions(body1).forEach((result: Partial<Result>) => {
      Physics.pushBack(body1, result)
    })
    system.update()

    expect(system.detectCollisions(body1).length).toBe(0)
  })
})
