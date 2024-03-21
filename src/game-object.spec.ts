import 'pixi-shim';
import 'pixi.js-legacy';
import { Component } from './component';
import { GameObject } from './game-object';
import { CircleBody } from './circle-body';
import { Scene } from './scene';

describe('GIVEN GameObject', () => {
  it('THEN you can add component', () => {
    const go = new GameObject();
    const component = new Component(go);

    expect(go.components.length).toBe(1);
  });

  it('THEN update propagates to components', () => {
    const go = new GameObject();
    const component1 = new Component(go);
    const component2 = new Component(go);

    jest.spyOn(component1, 'update');
    jest.spyOn(component2, 'update');

    go.update();

    expect(component1.update).toHaveBeenCalled();
    expect(component2.update).toHaveBeenCalled();
  });

  it('THEN you can remove component', () => {
    const go = new GameObject();
    const component = new Component(go);

    go.removeComponent(component);
    expect(go.components.length).toBe(0);
  });

  it('THEN destroy removes component', () => {
    const go = new GameObject();
    const component = new Component(go);

    component.destroy();
    expect(go.components.length).toBe(0);
  });

  it('THEN you can get component by label', () => {
    const go = new GameObject();
    const component = new Component(go);

    expect(go.getComponentOfType('Component')).toBeTruthy();
  });

  it('THEN you can get components by label', () => {
    const go = new GameObject();
    const component = new Component(go);

    expect(go.getComponentsOfType('Component').length).toBe(1);
  });

  it('THEN you can destroy 1000 bodies without problem', () => {
    const scene = new Scene();

    jest.spyOn(scene, 'addChild');
    jest.spyOn(scene, 'removeChild');

    for (let i = 0; i < 1000; i++) {
      const go: GameObject = new GameObject();
      const body = new CircleBody(go, 100);

      scene.addChild(go);
      expect(go.components.length).toBe(1);
    }

    expect(scene.addChild).toHaveBeenCalledTimes(1000);
    expect(scene.children.length).toBe(1000);

    scene.destroy();
    expect(scene.removeChild).toHaveBeenCalledTimes(1000);
    expect(scene.children.length).toBe(0);
  });
});
