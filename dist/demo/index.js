'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const resources_1 = require('../resources');
const scene_1 = require('../scene');
const sprite_prefab_1 = require('./sprite.prefab');
const takeUntil_1 = require('rxjs/internal/operators/takeUntil');
async function start() {
  const queryParams = scene_1.Scene.getQueryParams();
  globalThis.queryParams = queryParams;
  // create main Scene
  const scene = new scene_1.Scene({
    visible: true,
    autoSort: true,
    showFPS: 'fps' in queryParams,
    debug: 'debug' in queryParams
  });
  // initialize scene async - new since pixi 7/8
  await scene.init({
    resizeTo: window,
    autoDensity: true,
    autoStart: false,
    sharedTicker: false
  });
  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const data = await resources_1.Resources.loadResource('./cave-boy.json');
  const texture = await resources_1.Resources.loadResource(data.tileset);
  // create 50 sprites from template
  Array.from({ length: Number(queryParams.limit || 50) }, () => {
    (0, sprite_prefab_1.create)({ scene, data, texture });
  });
  scene.start();
  scene.update$
    .pipe((0, takeUntil_1.takeUntil)(scene.destroy$))
    .subscribe(() => {
      scene.physics.separate();
    });
  globalThis.scene = scene;
}
start();
