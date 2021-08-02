import 'pixi-shim'
import 'pixi.js-legacy'
import { Scene } from './scene'

describe('GIVEN Scene', () => {
  it('THEN it works', (done) => {
    const scene = new Scene()

    expect(scene).toBeTruthy()

    setTimeout(done);
  })
})
