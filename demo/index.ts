import { takeUntil } from 'rxjs'
import { Scene, GameObject } from '../src'
import { prefab, preload, follow } from './sprite.prefab'

const scene: Scene = new Scene({ visible: true, autoSize: true })
const sprites: GameObject[] = []

preload().then(async () => {
  for (let i = 0; i < 1000; i++) {
    const sprite: GameObject = await GameObject.instantiate(prefab)

    scene.addChild(sprite)
    sprites.push(sprite)
    sprite.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(follow(sprite, sprites))
  }

  scene.pixi.renderer.backgroundColor = 0xcccccc
  scene.start()
})
