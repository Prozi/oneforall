'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Lifecycle = void 0;
const Subject_1 = require('rxjs/internal/Subject');
class Lifecycle {
  constructor() {
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
     * Lifecycles can have children Lifecycles
     */
    this.children = [];
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    this.label = 'Lifecycle';
  }
  static destroy(lifecycle) {
    var _a, _b;
    // tslint:disable-next-line: no-any
    (_b =
      (_a = lifecycle.gameObject) === null || _a === void 0
        ? void 0
        : _a.removeChild) === null || _b === void 0
      ? void 0
      : _b.call(_a, lifecycle);
    lifecycle.update$.complete();
    lifecycle.destroy$.next();
    lifecycle.destroy$.complete();
  }
  static update(lifecycle, deltaTime) {
    lifecycle.update$.next(deltaTime);
  }
  destroy() {
    Lifecycle.destroy(this);
  }
  /**
   * Updates the Lifecycle with actual deltaTime = 1.0 for 60FPS
   */
  update(deltaTime) {
    Lifecycle.update(this, deltaTime);
  }
}
exports.Lifecycle = Lifecycle;
