import 'pixi-shim'
import { GameObject } from '.'

describe('GIVEN index.ts', () => {
  it('THEN basic imports work', () => {
    expect(new GameObject()).toBeTruthy()
  })
})
