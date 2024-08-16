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
Object.defineProperty(exports, '__esModule', { value: true });
exports.SceneSSR = void 0;
const PIXI = __importStar(require('pixi.js'));
const detect_collisions_1 = require('detect-collisions');
const game_object_1 = require('./game-object');
const Subject_1 = require('rxjs/internal/Subject');
/**
 * base scene for server side rendering
 */
class SceneSSR extends game_object_1.GameObject {
  constructor(options = {}) {
    super(options.label || 'Scene');
    /**
     * When Scene Object has children amount changed, it emits this subject.
     */
    this.children$ = new Subject_1.Subject();
    /**
     * Scene doesn't have parent gameObject
     */
    this.gameObject = undefined;
    /**
     * requestAnimationFrame reference.
     */
    this.animationFrame = 0;
    this.options = options;
    this.physics = new detect_collisions_1.System(options.nodeMaxEntries);
    this.stage = new PIXI.Container();
    this.stage.label = 'Stage';
  }
  /**
   * Scene doesn't have parent scene
   */
  get scene() {
    return undefined;
  }
  async init(_options) {
    return true;
  }
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  start() {
    this.lastUpdate = Date.now();
    const frame = () => {
      const now = Date.now();
      const deltaTime = (now - this.lastUpdate) * 0.06;
      // 60 / 1000
      this.update(deltaTime);
      this.lastUpdate = now;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      this.animationFrame = requestAnimationFrame(frame);
    };
    this.animationFrame = requestAnimationFrame(frame);
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.physics.update();
  }
  destroy() {
    this.stop();
    super.destroy();
    this.children$.complete();
  }
  stageAddChild(...children) {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.addChild(deep);
        }
      });
    });
  }
  addChild(...children) {
    super.addChild(...children);
    this.stageAddChild(...children);
  }
  stageRemoveChild(...children) {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof PIXI.Container) {
          this.stage.removeChild(deep);
        }
      });
    });
  }
  removeChild(...children) {
    super.removeChild(...children);
    this.stageRemoveChild(...children);
  }
  getChildOfType(type) {
    return this.children.find(({ label }) => label === type);
  }
  getChildrenOfType(type) {
    return this.children.filter(({ label }) => label === type);
  }
}
exports.SceneSSR = SceneSSR;
