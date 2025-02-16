'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Resources = void 0;
const PIXI = __importStar(require('pixi.js'));
const cache_1 = require('@pietal.dev/cache');
class Resources {
  static async loadResource(url) {
    return await _a.cache.get(url);
  }
  static async loadResources(resources) {
    const promises = resources.map(async (url) => _a.loadResource(url));
    const results = await Promise.all(promises);
    return results.reduce((resolved, resource, index) => {
      const name = resources[index];
      return Object.assign(Object.assign({}, resolved), { [name]: resource });
    }, {});
  }
  static async get(url) {
    return await _a.loadResource(url);
  }
  static async load(url) {
    return new Promise((resolve, reject) => {
      if ('Assets' in PIXI) {
        const { loader } = PIXI.Assets;
        loader.load(url).then(resolve).catch(reject);
      } else {
        const loader = new PIXI.Loader();
        loader.add(url);
        loader.onError.add(reject);
        loader.load((_, resources) => {
          const response = resources[url];
          resolve(response.texture || response.data);
        });
      }
    });
  }
}
exports.Resources = Resources;
_a = Resources;
Resources.cache = new cache_1.Cache(async (url) => {
  return _a.load(url);
});
