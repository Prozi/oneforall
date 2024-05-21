import 'pixi-shim';

import { CircleBody } from './circle-body';
import { GameObject } from './game-object';

describe('GIVEN CircleBody', () => {
  it('THEN it has set property radius', () => {
    const go = new GameObject();
    const body = new CircleBody(go, 15);

    expect(body.radiusX).toBe(15);
    expect(body.radiusY).toBe(15);
  });

  it('THEN it can\'t have zero radius', () => {
    const go = new GameObject();
    const createBody = () => new CircleBody(go, 0);

    expect(createBody).toThrow();
  });

  it('THEN update propagates x/y changes', () => {
    const go = new GameObject();
    const body = new CircleBody(go, 15);

    body.x += 50;
    go.update(20);

    expect(go.x).toBe(50);
  });
});
