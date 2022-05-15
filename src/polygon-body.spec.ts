import "pixi-shim";
import { GameObject } from "./game-object";
import { PolygonBody } from "./polygon-body";

describe("GIVEN PolygonBody", () => {
  it("THEN update propagates x/y changes", () => {
    const go = new GameObject();
    const body = new PolygonBody(go, [
      [0, 0],
      [1, 1],
    ]);

    body.x += 50;
    go.update();

    expect(go.x).toBe(50);
  });
});
