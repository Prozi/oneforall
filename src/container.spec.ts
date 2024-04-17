import 'pixi-shim';

import { Container } from './container';
import { GameObject } from './game-object';

describe('GIVEN Container', () => {
  it('THEN update propagates x/y changes', () => {
    const go = new GameObject();
    const container = new Container(go);

    go.x = 50;
    go.update(20);

    expect(container.x).toBe(50);
  });

  it('THEN destroy works', () => {
    const go = new GameObject();
    const container = new Container(go);

    container.destroy();
    expect(go.children.length).toBe(0);
  });
});
