import * as PIXI from "pixi.js";
import { takeUntil } from "rxjs";
import { Scene, Resources } from "../dist";
import { createSprite } from "../dist/demo/sprite.prefab";

async function start() {
  // create Scene
  const scene: Scene = new Scene({
    // with few optional params
    visible: true,
    autoSort: true,
  });

  // new since pixi 7/8
  await scene.pixi.init({
    autoStart: false,
    sharedTicker: false,
    resizeTo: window,
    autoDensity: true,
  });

  document.body.appendChild(scene.pixi.canvas);

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const data = await Resources.loadResource<{ tileset: string }>(
    "./cave-boy.json",
  );
  const texture = await Resources.loadResource(data.tileset);

  // create 50 sprites from that
  Array.from({ length: 50 }, () => createSprite({ scene, data, texture }));

  const gfx = new PIXI.Graphics();

  scene.addChild(gfx);

  // separate sprites
  scene.update$?.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate();

    gfx.clear();
    gfx.lineStyle(1, 0xffffff);

    scene.physics.draw(gfx as any);

    gfx.lineStyle(1, 0x00ff00);

    scene.physics.drawBVH(gfx as any);
  });

  scene.start();
}

start();
