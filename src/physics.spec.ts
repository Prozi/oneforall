import { Physics } from './physics'

describe('GIVEN Physics', () => {
  it('THEN it can be created', () => {
    const system = new Physics()

    expect(system).toBeTruthy()
  })

  it('THEN createPolygon works', () => {
    const system = new Physics()

    expect(
      system.createPolygon({}, [
        { x: 1, y: 1 },
        { x: 2, y: 2 }
      ])
    ).toBeTruthy()
  })

  it('THEN createCircle works', () => {
    const system = new Physics()

    expect(system.createCircle({}, 50)).toBeTruthy()
  })

  it('THEN remove works', () => {
    const system = new Physics()
    const body = system.createCircle({}, 50)
    const removeBody = () => system.remove(body)

    expect(removeBody).not.toThrow()
  })

  it('THEN getPotentials works', () => {
    const system = new Physics()
    const body1 = system.createCircle({ x: 30, y: 30 }, 50)
    const body2 = system.createCircle({ x: 20, y: 20 }, 50)

    system.update()

    expect(system.getPotentials(body1).length).toBe(1)
  })

  it('THEN separate ignores bodies with isTrigger', () => {
    const system = new Physics()
    const body1: any = system.createCircle({ x: 30, y: 30 }, 50)
    const body2: any = system.createCircle({ x: 20, y: 20 }, 50)

    body2.isTrigger = true

    expect(system.getPotentials(body1).length).toBe(1)

    system.separate()
    system.update()

    expect(system.getPotentials(body1).length).toBe(1)
  })

  it('THEN checkOne with move away works', () => {
    const system = new Physics()
    const body1: any = system.createCircle({ x: 30, y: 30 }, 50)
    const body2: any = system.createCircle({ x: 20, y: 20 }, 50)

    system.update()
    system.checkOne(body1, ({ overlapV }: any) => {
      body1.pos.x -= overlapV.x
      body1.pos.x -= overlapV.y
    })
    system.update()

    expect(system.getPotentials(body1).length).toBe(0)
  })
})
