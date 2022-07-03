import "pixi-shim";
import { GameObject } from "./game-object";
import { PolygonBody } from "./polygon-body";

describe("GIVEN PolygonBody", () => {
  it("THEN update propagates x/y changes", () => {
    const go = new GameObject();
    const body = new PolygonBody(go, [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);

    body.x += 50;
    go.update();

    expect(go.x).toBe(50);
  });
});
