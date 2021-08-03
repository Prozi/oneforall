import * as PIXI from 'pixi.js'
import {
  GameObject,
  Prefab,
  StateMachine,
  Sprite,
  CircleBody,
  Physics,
  Resources
} from '../src'

export async function preload(): Promise<PIXI.Texture> {
  const { texture } = await Resources.loadResource('./github-logo.png')

  return texture
}

export const prefab: Prefab = new Prefab(
  'SpritePrefab',
  async (gameObject: GameObject | any) => {
    gameObject.sprite = new Sprite(gameObject, await preload())
    gameObject.state = new StateMachine(gameObject)
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
    }

    if (Math.random() < 0.05) {
      gameObject.state.setState('RUN_AWAY')
    }

    if (Math.random() < 0.05) {
      gameObject.state.setState('INITIAL_STATE')
    }

    if (gameObject.target) {
      const direction: number = gameObject.state.state !== 'RUN_AWAY' ? 1 : -1
      const arc: number = Math.atan2(
        direction * (gameObject.y - gameObject.target.y),
        direction * (gameObject.x - gameObject.target.x)
      )

      Physics.pushBack(gameObject.body, {
        overlap: 1,
        overlap_x: Math.cos(arc),
        overlap_y: Math.sin(arc)
      })
    }
  }
}
