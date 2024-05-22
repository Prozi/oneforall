import 'pixi-shim';

import { GameObject } from './game-object';
import { SceneSSR } from './scene-ssr';
import { StateMachine } from './state-machine';

describe('GIVEN SceneSSR', () => {
  it('THEN it works', () => {
    const scene = new SceneSSR();

    expect(scene).toBeTruthy();
  });

  it('THEN it can have children', () => {
    const scene = new SceneSSR({
      label: 'MySceneSSR1',
      visible: true
    });
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());

    expect(scene.children.length).toBe(3);
  });

  it('THEN scene propagates update to gameobject to component', () => {
    const scene = new SceneSSR({
      label: 'MySceneSSR1',
      visible: true
    });
    const go = new GameObject();
    const state = new StateMachine(go);

    jest.spyOn(go, 'update');
    jest.spyOn(state, 'update');

    scene.addChild(go);
    scene.update(20);

    expect(go.update).toHaveBeenCalled();
    expect(state.update).toHaveBeenCalled();
  });
});
