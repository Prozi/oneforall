import 'pixi-shim';
import 'pixi.js-legacy';

import { Resources } from './resources';

describe('GIVEN Resources', () => {
  // @TODO: cant make it work for both pixi v6 and v8 same way
  xit('THEN it rejects with error on not found', (done) => {
    Resources.get('foobar').catch((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });
});
