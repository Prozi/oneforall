import { takeUntil } from 'rxjs'
import { Scene, GameObject, Prefab, Resources, Physics } from '../src'
import {
  createPrefab,
  stateChangeAllowed,
  update
} from '../src/demo/sprite.prefab'

async function start() {
  // create PIXI.Scene with bonuses
  const scene: Scene = new Scene({
    visible: true,
    autoSize: true,
    autoSort: true,
    scale: 1.3
  })

  // wait to load cave-boy.json and cave-boy.png
  const { data } = await Resources.loadResource('./cave-boy.json')
  const { texture } = await Resources.loadResource(data.tileset)
  // create prefab once
  const prefab: Prefab = createPrefab(data, texture)
  // create 50 sprites using prefab
  const sprites = await Promise.all(
    Array.from({ length: 50 }, () => GameObject.instantiate(prefab))
  )

  // extend sprites
  sprites.forEach((sprite: GameObject) => {
    // add to scene
    scene.addChild(sprite)
    // subscribe to our own update function
    sprite.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(update(sprite, sprites))
  })

  Physics.collision$.subscribe(
    (gameObject: GameObject & { [prop: string]: any }) => {
      if (stateChangeAllowed(gameObject)) {
        gameObject.target = null
        gameObject.sprite.setState('wow2', false, 'idle')
      }
    }
  )

  scene.start()
}

start()
