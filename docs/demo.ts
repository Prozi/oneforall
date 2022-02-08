import { takeUntil } from 'rxjs'
import { Scene, Resources } from '../dist'
import { createSprite } from '../dist/demo/sprite.prefab'

async function start() {
  // create Scene
  const scene: Scene = new Scene({
    // with few optional params
    visible: true,
    autoSize: true,
    autoSort: true
  })

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const { data } = await Resources.loadResource('./cave-boy.json')
  const { texture } = await Resources.loadResource(data.tileset)

  // create 50 sprites from that
  Array.from({ length: 50 }, () => createSprite({ scene, data, texture }))

  // separate sprites
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate()
  })

  scene.start()
}

start()
