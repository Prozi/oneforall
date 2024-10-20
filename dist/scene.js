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
Object.defineProperty(exports, '__esModule', { value: true });
exports.Scene = void 0;
const PIXI = __importStar(require('pixi.js'));
const scene_ssr_1 = require('./scene-ssr');
const application_1 = require('./application');
const inject_min_1 = require('inject.min');
const resources_1 = require('./resources');
const pixi_stats_1 = require('pixi-stats');
const Subject_1 = require('rxjs/internal/Subject');
const merge_1 = require('rxjs/internal/observable/merge');
const takeUntil_1 = require('rxjs/internal/operators/takeUntil');
/**
 * base scene for front end rendering
 */
class Scene extends scene_ssr_1.SceneSSR {
  constructor(options = {}) {
    super(options);
    /**
     * When disableAutoSort is called, it emits this subject.
     */
    this.disableAutoSort$ = new Subject_1.Subject();
    /**
     * When disableDebug is called, it emits this subject.
     */
    this.disableDebug$ = new Subject_1.Subject();
    this.stage.visible = this.options.visible || false;
    if (this.pixi) {
      this.pixi.stage.addChild(this.stage);
      this.pixi.stage.label = 'PixiStage';
    }
    if (this.options.autoSort) {
      this.enableAutoSort();
    }
    if (this.options.debug) {
      this.enableDebug();
    }
    globalThis.PIXI = PIXI;
    globalThis.scene = this;
    globalThis.__PIXI_APP__ = this.pixi;
  }
  static getQueryParams() {
    if (typeof location === 'undefined') {
      return {};
    }
    const matches = location.search.matchAll(/[?&]([^=?&]+)=?([^?&]*)/g);
    return [...matches].reduce(
      // eslint-disable-next-line
      (queryParams, [_wholeMatch, paramName, paramValue]) =>
        Object.assign(Object.assign({}, queryParams), {
          [decodeURIComponent(paramName)]: decodeURIComponent(paramValue)
        }),
      {}
    );
  }
  async init(options) {
    if (this.pixi.isInitialized) {
      return false;
    }
    await this.pixi.init(options);
    if (this.pixi.canvas && !this.pixi.canvas.parentElement) {
      document.body.appendChild(this.pixi.canvas);
    }
    const showFPS = this.options.showFPS;
    if (showFPS) {
      this.showFPS(typeof showFPS === 'string' ? showFPS : undefined);
    }
    return true;
  }
  start() {
    var _a;
    (_a = this.pixi) === null || _a === void 0 ? void 0 : _a.start();
    super.start();
  }
  stop() {
    var _a, _b;
    (_b = (_a = this.pixi) === null || _a === void 0 ? void 0 : _a.stop) ===
      null || _b === void 0
      ? void 0
      : _b.call(_a);
    super.stop();
  }
  destroy() {
    var _a;
    super.destroy();
    (_a = this.pixi) === null || _a === void 0
      ? void 0
      : _a.stage.removeChild(this.stage);
  }
  addChild(gameObject) {
    super.addChild(gameObject);
    if (gameObject.sprite) {
      this.stage.addChild(gameObject.sprite);
    }
  }
  enableAutoSort() {
    this.stage.sortableChildren = true;
    this.update$
      .pipe(
        (0, takeUntil_1.takeUntil)(
          (0, merge_1.merge)(this.destroy$, this.disableAutoSort$)
        )
      )
      .subscribe(() => {
        this.stage.children.forEach((child) => {
          child.zIndex = child.y;
        });
      });
  }
  disableAutoSort() {
    this.stage.sortableChildren = false;
    this.disableAutoSort$.next();
  }
  enableDebug() {
    const debug = new PIXI.Graphics();
    this.pixi.stage.addChild(debug);
    this.update$
      .pipe(
        (0, takeUntil_1.takeUntil)(
          (0, merge_1.merge)(this.destroy$, this.disableDebug$)
        )
      )
      .subscribe(() => {
        this.onUpdateDebug(debug);
      });
  }
  disableDebug() {
    this.disableDebug$.next();
    this.pixi.stage.children.forEach((child) => {
      if (child instanceof PIXI.Graphics) {
        this.pixi.stage.removeChild(child);
        child.destroy();
      }
    });
  }
  /**
   * add body font family to set font of pixi-stats
   */
  showFPS(style = 'position: fixed; top: 0; right: 0; z-index: 1000;') {
    const stats = new pixi_stats_1.Stats(this.pixi.renderer);
    const canvas = stats.domElement;
    canvas.setAttribute('style', style);
  }
  onUpdateDebug(canvas) {
    const context = canvas;
    const debug =
      typeof this.options.debug === 'object' ? this.options.debug : {};
    canvas.clear();
    this.physics.draw(context);
    canvas.stroke(
      debug.debugStroke || {
        color: 0xffffff,
        width: 1.5,
        alpha: 1
      }
    );
    this.physics.drawBVH(context);
    canvas.stroke(
      debug.debugBVHStroke || {
        color: 0x00ff00,
        width: 1,
        alpha: 0.5
      }
    );
  }
}
exports.Scene = Scene;
__decorate(
  [(0, inject_min_1.Inject)(application_1.Application)],
  Scene.prototype,
  'pixi',
  void 0
);
__decorate(
  [(0, inject_min_1.Inject)(resources_1.Resources)],
  Scene.prototype,
  'resources',
  void 0
);
