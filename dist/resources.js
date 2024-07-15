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
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var Resources_1;
Object.defineProperty(exports, '__esModule', { value: true });
exports.Resources = void 0;
const PIXI = __importStar(require('pixi.js'));
const dependency_injection_1 = require('@pietal.dev/dependency-injection');
const cache_1 = require('@pietal.dev/cache');
let Resources = (Resources_1 = class Resources {
  static async loadResource(url) {
    return await Resources_1.cache.get(url);
  }
  static async loadResources(resources) {
    const promises = resources.map(async (url) =>
      Resources_1.loadResource(url)
    );
    const results = await Promise.all(promises);
    return results.reduce((resolved, resource, index) => {
      const name = resources[index];
      return Object.assign(Object.assign({}, resolved), { [name]: resource });
    }, {});
  }
  async get(url) {
    return Resources_1.loadResource(url);
  }
});
exports.Resources = Resources;
Resources.cache = new cache_1.Cache(async (url) =>
  PIXI.Assets.loader.load(url)
);
exports.Resources =
  Resources =
  Resources_1 =
    __decorate([dependency_injection_1.Injectable], Resources);
