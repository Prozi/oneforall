# One For All

<img src="https://raw.githubusercontent.com/Prozi/oneforall/main/all-might.png" alt="All Might from Boku No Hero Academia holds One For All in his palm" width="456" height="456" style="image-rendering: pixelated; max-width: 100%;" />

### TypeScript gamedev library inspired by Unity

[<img src="https://img.shields.io/npm/v/@pietal.dev/engine?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/@pietal.dev/engine?activeTab=versions)
[<img src="https://img.shields.io/circleci/build/github/Prozi/oneforall/main?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/oneforall)
[<img src="https://img.shields.io/npm/l/@pietal.dev/engine.svg?style=for-the-badge&color=success" alt="license: MIT" />](https://github.com/Prozi/oneforall/blob/master/LICENSE)

## Demo

```
[1x Scene]
  ├──[1x WebGL Canvas (pixi.js)]
  ├──[1x Collision Detection]
  └──[50x GameObject (Player)]
       ├──[1x CircleBody]
       └──[1x Animator]
            └──[1x StateMachine]
```

Tiny code, big results! Check out the [demo](https://prozi.github.io/oneforall/demo/?fps&debug) to see below code in action.

Also, here is the [documentation](https://prozi.github.io/oneforall/modules.html).

## Demo Code

`src/demo/index.ts`

```typescript
async function start(): Promise<void> {
  const queryParams = Scene.getQueryParams();
  // create main Scene
  const scene: Scene = new Scene({
    visible: true,
    autoSort: true,
    showFPS: 'fps' in queryParams,
    debug: 'debug' in queryParams
  });

  // initialize scene async - new since pixi 7/8
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
  Array.from({ length: Number(queryParams.limit || 50) }, () => {
    create({ scene, data, texture });
  });

  scene.start();
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate();
  });
}

start();
```

`src/demo/sprite.prefab.ts`

```typescript
export function create({ scene, data, texture }): TGameObject {
  // create game object
  const gameObject = new GameObject('Player') as TGameObject;

  // create body
  gameObject.body = new CircleBody(gameObject, 20, 14, 20, { padding: 7 });
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  );

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture);
  gameObject.sprite.setState('idle');

  // insert body to physics and game object to scene
  scene.addChild(gameObject);

  // subscribe to *own* update function until *own* destroy
  gameObject.update$
    .pipe(takeUntil(gameObject.destroy$))
    .subscribe((deltaTime) => {
      update(gameObject, deltaTime);
    });

  return gameObject;
}

export function update(gameObject: TGameObject, deltaTime: number): void {
  const scene = gameObject.scene;
  const scale = scene.stage.scale;
  const gameObjects = scene.children as TGameObject[];
  // at 60fps deltaTime = 1.0, at 30fps deltaTime = 2.0
  const safeDelta = Math.min(deltaTime, 2);
  const chance = safeDelta * 0.01;

  if (Math.random() < chance) {
    // goto random place
    gameObject.target = {
      x: (Math.random() * innerWidth) / scale.x,
      y: (Math.random() * innerHeight) / scale.y
    };
  } else if (Math.random() < chance) {
    // goto random target
    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)];
  } else if (Math.random() < chance) {
    // stop
    gameObject.target = null;
  }

  if (gameObject.target && distance(gameObject.target, gameObject) < 9) {
    gameObject.target = null;
  }

  if (!gameObject.target) {
    gameObject.sprite.setState('idle');
  } else {
    gameObject.sprite.setState('run');

    const angle: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );
    if (!isNaN(angle)) {
      const offsetX: number = Math.cos(angle);
      const offsetY: number = Math.sin(angle);

      if (gameObject.sprite instanceof Animator) {
        const flipX: number =
          Math.sign(offsetX || gameObject.sprite.scale.x) *
          Math.abs(gameObject.sprite.scale.x);
        // flip x so there is no need to duplicate sprites
        gameObject.sprite.setScale(flipX, gameObject.sprite.scale.y);
      }

      // update body which updates gameObject game object
      gameObject.body.setPosition(
        gameObject.body.x + safeDelta * offsetX,
        gameObject.body.y + safeDelta * offsetY
      );
    }
  }
}
```

## Features

- [Unity-inspired architecture](https://docs.unity3d.com/Manual/CreatingGameplay.html)
- [State management](https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867)
- [Reactive events](https://www.learnrxjs.io/learn-rxjs/subjects)
- [Lifecycle cleanup management](https://www.html5gamedevs.com/topic/44780-best-way-to-remove-objects-from-the-stage/)
- [Collision detection](https://npmjs.com/package/detect-collisions)
- [Drawing on WebGL canvas](https://npmjs.com/package/pixi.js)
- Compatible with pixi version 6, 7 and 8 - at the same time!

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
- **TextureAtlas:** Allows easy slicing of texture into smaller cached slices.

## Installation

```bash
npm i @pietal.dev/engine -D
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

 PASS  src/scene-ssr.spec.ts
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
