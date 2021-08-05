import { takeUntil } from 'rxjs'
import { Scene, GameObject, Prefab } from '../src'
import { preload, createPrefab, update } from '../src/demo/sprite.prefab'

const scene: Scene = new Scene({
  visible: true,
  autoSize: true,
  autoSort: true,
  scale: 1.3
})
const sprites: Array<GameObject> = []

preload('./cave-boy').then(async ({ data, texture }) => {
  const prefab: Prefab = createPrefab(data, texture)

  for (let i = 0; i < 50; i++) {
    const sprite: GameObject = await GameObject.instantiate(prefab)

    scene.addChild(sprite)
    sprites.push(sprite)
    sprite.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(update(sprite, sprites))
  }

  scene.pixi.renderer.backgroundColor = 0xcccccc
  scene.start()
})
