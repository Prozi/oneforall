import 'pixi-shim';
import 'pixi.js-legacy';

import { Resources } from './resources';

describe('GIVEN Resources', () => {
  it('THEN it silently fails and proceeds', () => {
    const resources = new Resources();

    expect(resources.get('foobar')).toBeTruthy();
  });
});
