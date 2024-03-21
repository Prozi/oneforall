import 'pixi-shim';
import 'pixi.js-legacy';
import { GameObject } from './game-object';
import { StateMachine } from './state-machine';
import { Scene } from './scene';

describe('GIVEN Scene', () => {
  it('THEN it works', () => {
    const scene = new Scene();

    expect(scene).toBeTruthy();
  });

  it('THEN it can have children', () => {
    const scene = new Scene({
      label: 'MyScene1',
      scale: 2,
      visible: true
    });
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());
    scene.addChild(new GameObject());

    expect(scene.children.length).toBe(3);
  });

  it('THEN scene propagates update to gameobject to component', () => {
    const scene = new Scene({
      label: 'MyScene1',
      scale: 2,
      visible: true
    });
    const go = new GameObject();
    const state = new StateMachine(go);

    jest.spyOn(go, 'update');
    jest.spyOn(state, 'update');

    scene.addChild(go);
    scene.update();

    expect(go.update).toHaveBeenCalled();
    expect(state.update).toHaveBeenCalled();
  });
});
