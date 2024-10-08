import 'pixi-shim';
import 'pixi.js-legacy';

import * as PIXI from 'pixi.js';

import { GameObject, TGameObject } from './game-object';

import { CircleBody } from './circle-body';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { Sprite } from './sprite';
import { StateMachine } from './state-machine';

type ExtendedGO = TGameObject<Sprite> & {
  stateMachine?: StateMachine;
};

describe('GIVEN Prefab', () => {
  it('THEN can be instantiated', async () => {
    const prefab = new Prefab('MyPrefab', async (go: GameObject) => {
      go.x = 120;
      go.y = 60;
      (go as ExtendedGO).stateMachine = new StateMachine(go);
    });
    const instance: GameObject = await GameObject.instantiate(prefab);

    expect(instance).toBeTruthy();
    expect(instance.x).toBe(120);
    expect(instance.y).toBe(60);
    expect(instance.label).toBe('MyPrefab');
  });

  it('THEN can create 100 instances', async () => {
    const scene: Scene = new Scene({ visible: true });
    const prefab: Prefab = new Prefab('Soldier', async (gameObject) => {
      const go = gameObject as ExtendedGO;
      go.stateMachine = new StateMachine(go);
      go.sprite = new Sprite(go, PIXI.Texture.EMPTY);

      go.body = new CircleBody(go, 40);
      go.body.x = Math.random() * innerWidth;
      go.body.y = Math.random() * innerHeight;

      go.update(20);
      scene.addChild(go);
    });

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
