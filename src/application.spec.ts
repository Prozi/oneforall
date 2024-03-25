import 'pixi-shim';
import 'pixi.js-legacy';

import { Application } from './application';

describe('GIVEN Application', () => {
  it('THEN it works', () => {
    const app = new Application();

    expect(app).toBeTruthy();
  });
});
