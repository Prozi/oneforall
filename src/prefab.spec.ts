import 'pixi-shim'
import 'pixi.js-legacy'
import * as PIXI from 'pixi.js'
import { GameObject } from './game-object'
import { StateMachine } from './state-machine'
import { CircleBody } from './circle-body'
import { Sprite } from './sprite'
import { Prefab } from './prefab'
import { Scene } from './scene'

describe('GIVEN Prefab', () => {
  it('THEN can be instantiated', () => {
    const prefab = new Prefab('MyPrefab', (go: GameObject & any) => {
      go.x = 120
      go.y = 60
      go.state = new StateMachine(go)
    })
    const instance: GameObject = GameObject.instantiate(prefab)

    expect(instance).toBeTruthy()
    expect(instance.x).toBe(120)
    expect(instance.y).toBe(60)
    expect(instance.name).toBe('MyPrefab')
  })

  it('THEN can create 100 instances', () => {
    const scene: Scene = new Scene({ visible: true })
    const soldierPrefab: Prefab = new Prefab(
      'Soldier',
      (go: GameObject & any) => {
        go.state = new StateMachine(go)
        go.sprite = new Sprite(go, PIXI.Texture.WHITE)

        go.body = new CircleBody(go, 40)
        go.body.x = Math.random() * innerWidth
        go.body.y = Math.random() * innerHeight

        go.update()
        scene.addChild(go)
      }
    )

    const soldiers: GameObject[] = new Array(100)
      .fill(0)
      .map((_) => GameObject.instantiate(soldierPrefab))

    expect(soldiers).toBeTruthy()
    expect(soldiers.length).toBe(100)
    expect(soldiers[0]).toBeInstanceOf(GameObject)
    expect(soldiers[0].x).not.toBe(0)
    expect(soldiers[0].y).not.toBe(0)
  })
})
