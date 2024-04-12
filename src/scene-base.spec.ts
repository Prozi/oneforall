import 'pixi-shim';

import { GameObject } from './game-object';
import { SceneBase } from './scene-base';
import { StateMachine } from './state-machine';

describe('GIVEN SceneBase', () => {
  it('THEN it works', () => {
    const scene = new SceneBase();

    expect(scene).toBeTruthy();
  });

  it('THEN it can have children', () => {
    const scene = new SceneBase({
      label: 'MySceneBase1',
      scale: 2,
      visible: true
    });
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());

    expect(scene.children.length).toBe(3);
  });

  it('THEN scene propagates update to gameobject to component', () => {
    const scene = new SceneBase({
      label: 'MySceneBase1',
      scale: 2,
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
