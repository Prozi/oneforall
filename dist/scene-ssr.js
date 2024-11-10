'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SceneSSR = void 0;
const pixi_js_1 = require('pixi.js');
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
    this.stage = this.createStage();
    const nameKey = 'label' in this.stage ? 'label' : 'name';
    this.stage[nameKey] = 'SceneStage';
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
  addChild(...children) {
    super.addChild(...children);
    this.stageAddChild(...children);
    children.forEach(({ body }) => {
      if (body) {
        this.physics.insert(body);
      }
    });
  }
  stageAddChild(...children) {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof pixi_js_1.Container) {
          this.stage.addChild(deep);
        }
      });
    });
  }
  stageRemoveChild(...children) {
    children.forEach((child) => {
      this.recursive(child, (deep) => {
        if (deep instanceof pixi_js_1.Container) {
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
  createStage() {
    return new pixi_js_1.Container();
  }
}
exports.SceneSSR = SceneSSR;
