'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GameObject = exports.getRoot = void 0;
const Subject_1 = require('rxjs/internal/Subject');
const lifecycle_1 = require('./lifecycle');
const getRoot = (gameObject) => {
  let root = gameObject;
  do {
    root = root.gameObject;
  } while (root === null || root === void 0 ? void 0 : root.gameObject);
  return root;
};
exports.getRoot = getRoot;
class GameObject extends lifecycle_1.Lifecycle {
  constructor(label = 'GameObject', x = 0, y = 0) {
    super();
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    this.update$ = new Subject_1.Subject();
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    this.destroy$ = new Subject_1.Subject();
    this.label = label;
    this.x = x;
    this.y = y;
  }
  static async instantiate(prefab) {
    return prefab.instantiate();
  }
  /**
   * get parent scene if exists
   */
  get scene() {
    return (0, exports.getRoot)(this);
  }
  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime) {
    this.children.forEach((child) => {
      child.update(deltaTime);
    });
    lifecycle_1.Lifecycle.update(this, deltaTime);
  }
  destroy() {
    while (this.children.length) {
      const child = this.children.pop();
      // (!) does also child.gameObject.removeChild(child)
      child.destroy();
    }
    lifecycle_1.Lifecycle.destroy(this);
  }
  recursive(child, callback) {
    callback(child);
    if (child instanceof lifecycle_1.Lifecycle) {
      child.children.forEach((deep) => {
        this.recursive(deep, callback);
      });
    }
  }
  addChild(...children) {
    var _a;
    children.forEach((child) => {
      child.gameObject = this;
      const index = this.children.indexOf(child);
      if (index === -1) {
        this.children.push(child);
      }
    });
    // add pixi components
    (_a = this.scene) === null || _a === void 0
      ? void 0
      : _a.stageAddChild(...children);
  }
  removeChild(...children) {
    var _a;
    children.forEach((child) => {
      child.gameObject = null;
      const index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
      }
    });
    // remove pixi components
    (_a = this.scene) === null || _a === void 0
      ? void 0
      : _a.stageRemoveChild(...children);
  }
  getChildOfType(type) {
    return this.children.find(({ label }) => label === type);
  }
  getChildrenOfType(type) {
    return this.children.filter(({ label }) => label === type);
  }
}
exports.GameObject = GameObject;
