import 'pixi-shim';

import { BoxBody } from './box-body';
import { GameObject } from './game-object';

describe('GIVEN CircleBody', () => {
  it('THEN it has set property width and height', () => {
    const go = new GameObject();
    const body = new BoxBody(go, 100, 120);

    expect(body.width).toBe(100);
    expect(body.height).toBe(120);
  });

  it('THEN it has set property width but no height', () => {
    const go = new GameObject();
    const body = new BoxBody(go, 100);

    expect(body.width).toBe(100);
    expect(body.height).toBe(100);
  });

  it("THEN it can't have zero width", () => {
    const go = new GameObject();
    const createBody = () => new BoxBody(go, 0, 120);

    expect(createBody).toThrow();
  });

  it("THEN it can't have zero height", () => {
    const go = new GameObject();
    const createBody = () => new BoxBody(go, 100, 0);

    expect(createBody).toThrow();
  });

  it('THEN update propagates x/y changes', () => {
    const go = new GameObject();
    const body = new BoxBody(go, 100, 120);

    body.x += 50;
    go.update(20);

    expect(go.x).toBe(50);
  });
});
