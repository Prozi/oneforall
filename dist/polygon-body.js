'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PolygonBody = void 0;
const detect_collisions_1 = require('detect-collisions');
const lifecycle_1 = require('./lifecycle');
const Subject_1 = require('rxjs/internal/Subject');
class PolygonBody extends detect_collisions_1.Polygon {
  constructor(gameObject, points, options) {
    super(gameObject, points, options);
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
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    this.label = 'PolygonBody';
    gameObject.addChild(this);
  }
  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime) {
    this.gameObject.x = this.x;
    this.gameObject.y = this.y;
    lifecycle_1.Lifecycle.update(this, deltaTime);
  }
  destroy() {
    var _a;
    (_a = this.system) === null || _a === void 0 ? void 0 : _a.remove(this);
    lifecycle_1.Lifecycle.destroy(this);
  }
}
exports.PolygonBody = PolygonBody;
