import 'pixi-shim';
import 'pixi.js-legacy';
import * as PIXI from 'pixi.js';
import { Body } from 'detect-collisions';

import { GameObject } from './game-object';
import { StateMachine } from './state-machine';
import { CircleBody } from './circle-body';
import { Sprite } from './sprite';
import { Prefab } from './prefab';
import { Scene } from './scene';

type TGameObject = GameObject & { state: StateMachine; sprite: Sprite };

describe('GIVEN Prefab', () => {
  it('THEN can be instantiated', async () => {
    const prefab = new Prefab('MyPrefab', async (go: GameObject) => {
      go.x = 120;
      go.y = 60;
      (go as TGameObject).state = new StateMachine(go);
    });
    const instance: GameObject = await GameObject.instantiate(prefab);

    expect(instance).toBeTruthy();
    expect(instance.x).toBe(120);
    expect(instance.y).toBe(60);
    expect(instance.label).toBe('MyPrefab');
  });

  it('THEN can create 100 instances', async () => {
    const scene: Scene = new Scene({ visible: true });
    const prefab: Prefab = new Prefab(
      'Soldier',
      // tslint:disable-next-line: no-any
      async (
        go: GameObject & { state?: StateMachine; sprite?: Sprite; body?: Body }
      ) => {
        go.state = new StateMachine(go);
        go.sprite = new Sprite(go, PIXI.Texture.EMPTY);

        go.body = new CircleBody(go, 40);
        go.body.x = Math.random() * innerWidth;
        go.body.y = Math.random() * innerHeight;

        go.update();
        scene.addChild(go);
      }
    );

    const promises: Promise<GameObject>[] = new Array(100)
      .fill(0)
      .map(async () => GameObject.instantiate(prefab));

    const gameObjects: GameObject[] = await Promise.all(promises);

    expect(gameObjects).toBeTruthy();
    expect(gameObjects.length).toBe(100);
    expect(gameObjects[0]).toBeInstanceOf(GameObject);
    expect(gameObjects[0].x).not.toBe(0);
    expect(gameObjects[0].y).not.toBe(0);
  });
});
