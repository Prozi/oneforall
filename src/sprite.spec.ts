import 'pixi-shim';
import * as PIXI from 'pixi.js-legacy';

import { GameObject } from './game-object';
import { Scene } from './scene';
import { Sprite } from './sprite';

describe('GIVEN Sprite', () => {
  const whiteTexture = PIXI.Texture.EMPTY;

  it('THEN update propagates x/y changes', () => {
    const go = new GameObject();
    const sprite = new Sprite(go, whiteTexture);

    go.x = 50;
    go.update(20);

    expect(sprite.x).toBe(50);
  });

  it('THEN removeChild works', () => {
    const scene = new Scene();
    const go = new GameObject();

    scene.addChild(go);
    expect(scene.children.length).toBe(1);

    scene.removeChild(go);
    expect(scene.children.length).toBe(0);
    expect(go.children.length).toBe(0);
  });

  it('THEN destroy works', () => {
    const go = new GameObject();
    const sprite = new Sprite(go, whiteTexture);

    sprite.destroy();
    expect(go.children.length).toBe(0);
  });

  it('THEN destroy works extended', () => {
    const scene = new Scene();
    const go = new GameObject();
    const sprite = new Sprite(go, whiteTexture);

    scene.addChild(go);
    expect(go.children.length).toBe(1);
    expect(scene.children.length).toBe(1);

    sprite.destroy();
    expect(go.children.length).toBe(0);
    expect(scene.children.length).toBe(1);

    go.destroy();
    expect(go.children.length).toBe(0);
    expect(scene.children.length).toBe(0);
  });
});
