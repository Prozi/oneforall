# One For All

<table border="0" cellspacing="0" cellpadding="0">
<tr>
<td valign="top">
<h3 style="margin-top: 0;">TypeScript gamedev library inspired by Unity</h3>

[<img src="https://img.shields.io/npm/v/@jacekpietal/oneforall?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/@jacekpietal/oneforall?activeTab=versions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/oneforall/main?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/oneforall)
[<img src="https://img.shields.io/npm/l/@jacekpietal/oneforall.svg?style=for-the-badge&color=success" alt="license: MIT" />](https://github.com/Prozi/@jacekpietal/oneforall/blob/master/LICENSE)

<td>
<img src="https://raw.githubusercontent.com/Prozi/oneforall/main/all-might.png" alt="All Might from Boku No Hero Academia holds One For All in his palm" width="228" height="228" style="image-rendering: pixelated; min-width: 228px;" />
</td>
</td>
</tr>
</table>

## Demo

```
[1x Scene]
  ├──[1x HTML Canvas]
  ├──[1x Collision Detection]
  └──[50x GameObject (Player)]
       ├──[1x CircleBody]
       └──[1x Animator]
            └──[1x StateMachine]
```

Tiny code, big results! Check out the [demo](https://prozi.github.io/oneforall/) to see below code in action.

## Demo Code

`src/demo/sprite.prefab.ts`

```typescript
export function createSprite({ scene, data, texture }): TGameObject {
  // a base molecule
  const gameObject = new GameObject('Player') as TGameObject;

  // create body
  gameObject.body = new CircleBody(gameObject, 20, 14);
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  );

  scene.physics.insert(gameObject.body);
  scene.addChild(gameObject);

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture);
  gameObject.sprite.setState('idle', true);
  gameObject.sprite.children.forEach((child: PIXI.AnimatedSprite) =>
    child.anchor.set(0.5, 0.8)
  );

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe(() => updateSprite(gameObject));

  return gameObject;
}

export function updateSprite(gameObject: TGameObject): void {
  if (Math.random() < 0.05) {
    gameObject.target = {
      x: innerWidth / 2 / gameObject.scene.stage.scale.x,
      y: innerHeight / 2 / gameObject.scene.stage.scale.y
    };
  }

  if (Math.random() < 0.05) {
    gameObject.sprite.setState('roll', false, 'idle');
  }

  if (Math.random() < 0.05) {
    const gameObjects = gameObject.scene.children as TGameObject[];

    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)];

    gameObject.sprite.setState('run', true);
  }

  if (gameObject.target) {
    const arc: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );
    const overlapX: number = Math.cos(arc);
    const overlapY: number = Math.sin(arc);

    if (gameObject.sprite instanceof Animator) {
      const flip: number = Math.sign(overlapX) || 1;

      gameObject.sprite.setScale(flip, 1);
    }

    gameObject.body.setPosition(
      gameObject.body.x + overlapX,
      gameObject.body.y + overlapY
    );
  }
}
```

`src/demo/index.ts`

```typescript
async function start(): Promise<void> {
  // create Scene
  const scene: Scene = new Scene({
    visible: true,
    autoSort: true
  });

  // new since pixi 7/8
  await scene.init({
    resizeTo: window,
    autoDensity: true,
    autoStart: false,
    sharedTicker: false
  });

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const data = await Resources.loadResource('./cave-boy.json');
  const texture = await Resources.loadResource(data.tileset);

  // create 50 sprites from template
  Array.from({ length: 50 }, () => {
    createSprite({ scene, data, texture });
  });

  scene.start();
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate();
  });

  // for chrome plugin pixi debug devtools
  globalThis.__PIXI_APP__ = scene.pixi;
}
```

## Features

- [Unity-inspired architecture](https://docs.unity3d.com/Manual/CreatingGameplay.html)
- [State management](https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867)
- [Reactive events](https://www.learnrxjs.io/learn-rxjs/subjects)
- [Lifecycle cleanup management](https://www.html5gamedevs.com/topic/44780-best-way-to-remove-objects-from-the-stage/)
- [Collision detection](https://npmjs.com/package/detect-collisions)
- [Drawing on WebGL canvas](https://npmjs.com/package/pixi.js)

## Classes this library exports

- **Resources:** Handles loading game assets like images and JSON files.
- **Scene:** Sets the stage for gameplay, where all the action takes place.
- **GameObject:** Represents characters, objects, or items in the game world.
- **Prefab:** Instantiates ready-made templates for creating game elements.
- **Sprite:** Displays static 2D graphics in the game.
- **Container:** Organizes and manages groups of game objects for easier handling.
- **Animator:** Useful JSON to Container with AnimatedSprite children.
- **StateMachine:** Controls how game objects transition between actions.
- **CircleBody:** Adds physics properties and interactions for round-shaped objects.
- **PolygonBody:** Adds physics properties and interactions for polygonal objects.

## Installation

```bash
npm i @jacekpietal/oneforall --save
```

## We also have tests

```
 PASS  src/state-machine.spec.ts
  GIVEN StateMachine
    ✓ THEN you can set validators (4 ms)
    ✓ THEN you can't change state to invalid state
    ✓ THEN you can change state to valid state

 PASS  src/component.spec.ts
  GIVEN Component
    ✓ THEN update publishes update$ (1 ms)
    ✓ THEN destroy publishes destroy$

 PASS  src/circle-body.spec.ts
  GIVEN CircleBody
    ✓ THEN it has set property radius (5 ms)
    ✓ THEN it can't have zero radius (9 ms)
    ✓ THEN update propagates x/y changes

 PASS  src/scene-base.spec.ts
  GIVEN SceneBase
    ✓ THEN it works (3 ms)
    ✓ THEN it can have children (1 ms)
    ✓ THEN scene propagates update to gameobject to component (1 ms)

 PASS  src/scene.spec.ts
  GIVEN Scene
    ✓ THEN it works (2 ms)
    ✓ THEN it can have children
    ✓ THEN scene propagates update to gameobject to component (1 ms)

 PASS  src/sprite.spec.ts
  GIVEN Sprite
    ✓ THEN update propagates x/y changes (3 ms)
    ✓ THEN removeChild works
    ✓ THEN destroy works (1 ms)
    ✓ THEN destroy works extended (1 ms)

 PASS  src/prefab.spec.ts
  GIVEN Prefab
    ✓ THEN can be instantiated (3 ms)
    ✓ THEN can create 100 instances (10 ms)

 PASS  src/game-object.spec.ts
  GIVEN GameObject
    ✓ THEN you can add component (5 ms)
    ✓ THEN update propagates to components (1 ms)
    ✓ THEN you can remove component
    ✓ THEN destroy removes component (1 ms)
    ✓ THEN you can get component by label
    ✓ THEN you can get components by label
    ✓ THEN you can destroy 1000 bodies without problem (106 ms)

 PASS  src/polygon-body.spec.ts
  GIVEN PolygonBody
    ✓ THEN update propagates x/y changes

 PASS  src/container.spec.ts
  GIVEN Container
    ✓ THEN update propagates x/y changes
    ✓ THEN destroy works (1 ms)

 PASS  src/resources.spec.ts
  GIVEN Resources
    ✓ THEN it silently fails and proceeds (5 ms)

 PASS  src/index.spec.ts
  GIVEN index.ts
    ✓ THEN basic imports work (1 ms)

 PASS  src/application.spec.ts
  GIVEN Application
    ✓ THEN it works

Test Suites: 13 passed, 13 total
Tests:       33 passed, 33 total
```
