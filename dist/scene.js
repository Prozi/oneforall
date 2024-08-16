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
const pixi_stats_1 = require('pixi-stats');
const application_1 = require('./application');
const dependency_injection_1 = require('@pietal.dev/dependency-injection');
const resources_1 = require('./resources');
const Subject_1 = require('rxjs/internal/Subject');
const merge_1 = require('rxjs/internal/observable/merge');
const takeUntil_1 = require('rxjs/internal/operators/takeUntil');
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
    this.stage.label = 'SceneStage';
    this.pixi.stage.addChild(this.stage);
    this.pixi.stage.label = 'PixiStage';
    if (this.options.autoSort) {
      this.enableAutoSort();
    }
    if (this.options.debug) {
      this.enableDebug();
    }
    globalThis.PIXI = PIXI;
    globalThis.__PIXI_APP__ = this.pixi;
    globalThis.scene = this;
  }
  static getQueryParams() {
    if (typeof location === 'undefined') {
      return {};
    }
    const matches = location.search.matchAll(/[?&]([^=?&]+)=?([^?&]*)/g);
    return [...matches].reduce(
      (queryParams, [_wholeMatch, paramName, paramValue]) =>
        Object.assign(Object.assign({}, queryParams), {
          [paramName]: paramValue
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
    this.pixi.start();
    super.start();
  }
  stop() {
    var _a, _b;
    (_b = (_a = this.pixi).stop) === null || _b === void 0
      ? void 0
      : _b.call(_a);
    super.stop();
  }
  destroy() {
    super.destroy();
    this.pixi.stage.removeChild(this.stage);
  }
  addChild(gameObject) {
    super.addChild(gameObject);
    if (gameObject.sprite) {
      this.stage.addChild(gameObject.sprite);
    }
    if (gameObject.body) {
      this.physics.insert(gameObject.body);
    }
  }
  enableAutoSort() {
    this.update$
      .pipe(
        (0, takeUntil_1.takeUntil)(
          (0, merge_1.merge)(this.destroy$, this.disableAutoSort$)
        )
      )
      .subscribe(() => {
        this.stage.children.sort((bodyA, bodyB) => bodyA.y - bodyB.y);
      });
  }
  disableAutoSort() {
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
    const stats = (0, pixi_stats_1.addStats)(document, this.pixi);
    const ticker = PIXI.Ticker.shared;
    const canvas = stats.stats.domElement;
    canvas.setAttribute('style', style);
    ticker.add(stats.update, stats, PIXI.UPDATE_PRIORITY.UTILITY);
  }
  onUpdateDebug(debug) {
    const canvas = debug;
    debug.clear();
    this.physics.draw(canvas);
    debug.stroke({
      color: 0xffffff,
      width: 1.5,
      alpha: 1
    });
    this.physics.drawBVH(canvas);
    debug.stroke({
      color: 0x00ff00,
      width: 1,
      alpha: 0.5
    });
  }
}
exports.Scene = Scene;
__decorate(
  [(0, dependency_injection_1.Inject)(application_1.Application)],
  Scene.prototype,
  'pixi',
  void 0
);
__decorate(
  [(0, dependency_injection_1.Inject)(resources_1.Resources)],
  Scene.prototype,
  'resources',
  void 0
);
