import { takeUntil } from 'rxjs'
import { Scene, GameObject } from '../src'
import { preload, prefab, update } from '../src/demo/sprite.prefab'

const scene: Scene | any = new Scene({ visible: true, autoSize: true })
const sprites: Array<GameObject | any> = []

preload().then(async () => {
  for (let i = 0; i < 1000; i++) {
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