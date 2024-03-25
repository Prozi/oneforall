import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Resources } from '../resources';
import { Scene } from '../scene';
import { createSprite } from './sprite.prefab';

async function start(): Promise<void> {
  // create Scene
  const scene: Scene = new Scene({
    visible: true,
    autoSort: true
  });

  // new since pixi 7/8
  await scene.init({
    resizeTo: window,
    autoDensity: true,
    autoStart: false,
    sharedTicker: false
  });

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const data = await Resources.loadResource('./cave-boy.json');
  const texture = await Resources.loadResource(data.tileset);

  // create 50 sprites from template
  Array.from({ length: 50 }, () => {
    createSprite({ scene, data, texture });
  });

  scene.start();
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate();
  });

  // for chrome plugin pixi debug devtools
  globalThis.__PIXI_APP__ = scene.pixi;
}

start();
