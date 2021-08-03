import * as PIXI from 'pixi.js'
import {
  GameObject,
  Prefab,
  StateMachine,
  Sprite,
  CircleBody,
  Physics,
  Resources
} from '..'

export async function preload(): Promise<PIXI.Texture> {
  const { texture } = await Resources.loadResource('./github-logo.png')

  return texture
}

export const prefab: Prefab = new Prefab(
  'SpritePrefab',
  async (gameObject: GameObject | any) => {
    gameObject.sprite = new Sprite(gameObject, await preload())
    gameObject.state = new StateMachine(gameObject, '[state] static')
    gameObject.body = new CircleBody(gameObject, gameObject.sprite.width / 2)
    gameObject.body.x = Math.random() * innerWidth
    gameObject.body.y = Math.random() * innerHeight
  }
)

export function update(
  gameObject: GameObject | any,
  gameObjects: Array<GameObject>
): () => void {
  return () => {
    if (Math.random() < 0.05) {
      gameObject.target =
        gameObjects[Math.floor(Math.random() * gameObjects.length)]

      if (Math.random() < 0.5) {
        gameObject.state.setState('[state] forwards target')
      } else {
        gameObject.state.setState('[state] backwards target')
      }
    }

    if (gameObject.target) {
      const overlap: number =
        gameObject.state.state === '[state] forwards target' ? 1 : -1
      const arc: number = Math.atan2(
        gameObject.y - gameObject.target.y,
        gameObject.x - gameObject.target.x
      )

      Physics.pushBack(gameObject.body, {
        overlap,
        overlap_x: Math.cos(arc),
        overlap_y: Math.sin(arc)
      })
    }
  }
}