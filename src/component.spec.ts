import { Component } from './component';
import { GameObject } from './game-object';

describe('GIVEN Component', () => {
  it('THEN update publishes update$', (done) => {
    const go = new GameObject();
    const component = new Component(go);

    component.update$?.subscribe(() => {
      done();
    });

    component.update();
  });

  it('THEN destroy publishes destroy$', (done) => {
    const go = new GameObject();
    const component = new Component(go);

    component.destroy$?.subscribe(() => {
      done();
    });

    component.destroy();
  });
});
