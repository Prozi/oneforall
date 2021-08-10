import { filter, takeUntil } from 'rxjs'
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

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const { data } = await Resources.loadResource('./cave-boy.json')
  const { texture } = await Resources.loadResource(data.tileset)
  // create prefab once
  const prefab: Prefab = createPrefab(data, texture)
  // create 50 sprites using prefab
  const gameObjects = await Promise.all(
    Array.from({ length: 50 }, () => GameObject.instantiate(prefab))
  )

  // extend sprites
  gameObjects.forEach((gameObject: GameObject) => {
    // add to scene
    scene.addChild(gameObject)
    // subscribe to our own update function
    gameObject.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(update(gameObject, gameObjects))
  })

  // on collision try to set sprite animation to wow
  Physics.collision$
    .pipe(takeUntil(scene.destroy$), filter(stateChangeAllowed))
    .subscribe((gameObject: GameObject & { [prop: string]: any }) => {
      gameObject.target = null
      gameObject.sprite.setState('wow2', false, 'idle')
    })

  scene.start()
}

start()
