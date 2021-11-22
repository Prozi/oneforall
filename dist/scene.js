"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Scene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pixi = require("pixi.js");

var PIXI = _interopRequireWildcard(_pixi);

var _rxjs = require("rxjs");

var _detectCollisions = require("detect-collisions");

var _dependencyInjection = require("@jacekpietal/dependency-injection");

var _application = require("./application");

var _resources = require("./resources");

var _component = require("./component");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Scene = exports.Scene = function (_Lifecycle) {
    _inherits(Scene, _Lifecycle);

    function Scene() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Scene);

        var _this = _possibleConstructorReturn(this, (Scene.__proto__ || Object.getPrototypeOf(Scene)).call(this));

        _this.children = new Set();
        _this.children$ = new _rxjs.Subject();
        _this.physics = new _detectCollisions.System();
        _this.stage = new PIXI.Container();
        _this.destroy$ = new _rxjs.Subject();
        _this.name = options.name || 'Scene';
        _this.scale = options.scale || 1;
        // 1 additonal layer
        _this.stage.visible = options.visible || false;
        if (options.autoSize) {
            _this.enableAutoSize();
        }
        if (options.autoSort) {
            _this.enableAutoSort();
        }
        // real stage
        _this.pixi.stage.addChild(_this.stage);
        return _this;
    }

    _createClass(Scene, [{
        key: "stop",
        value: function stop() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            this.pixi.stop();
        }
    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            var loop = function loop() {
                _this2.update();
                _this2.animationFrame = requestAnimationFrame(loop);
            };
            loop();
            this.pixi.stage.scale.set(this.scale);
            this.pixi.start();
        }
    }, {
        key: "enableAutoSize",
        value: function enableAutoSize() {
            var _this3 = this;

            this.pixi.renderer.resize(innerWidth, innerHeight);
            (0, _rxjs.fromEvent)(window, 'resize').pipe((0, _rxjs.takeUntil)(this.destroy$)).subscribe(function () {
                _this3.pixi.renderer.resize(innerWidth, innerHeight);
            });
        }
    }, {
        key: "enableAutoSort",
        value: function enableAutoSort() {
            var _this4 = this;

            this.update$.pipe((0, _rxjs.takeUntil)(this.destroy$)).subscribe(function () {
                _this4.stage.children.sort(function (a, b) {
                    return a.y - b.y;
                });
            });
        }
    }, {
        key: "update",
        value: function update() {
            this.physics.update();
            Array.from(this.children.values()).forEach(function (child) {
                return child.update();
            });
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "update", this).call(this);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            var _a;
            (_a = this.stage.parent) === null || _a === void 0 ? void 0 : _a.removeChild(this.stage);
            this.stage.destroy();
            this.stop();
            _get(Scene.prototype.__proto__ || Object.getPrototypeOf(Scene.prototype), "destroy", this).call(this);
        }
    }, {
        key: "addChild",
        value: function addChild(child) {
            if (this.children.has(child)) {
                return;
            }
            child.parent = this;
            this.children.add(child);
            this.children$.next();
        }
    }, {
        key: "removeChild",
        value: function removeChild(child) {
            if (!this.children.has(child)) {
                return;
            }
            child.parent = null;
            this.children.delete(child);
            this.children$.next();
        }
    }, {
        key: "getChildOfType",
        value: function getChildOfType(type) {
            return Array.from(this.children.values()).find(function (_ref) {
                var name = _ref.name;
                return name === type;
            });
        }
    }, {
        key: "getChildrenOfType",
        value: function getChildrenOfType(type) {
            return Array.from(this.children.values()).filter(function (_ref2) {
                var name = _ref2.name;
                return name === type;
            });
        }
    }]);

    return Scene;
}(_component.Lifecycle);

__decorate([(0, _dependencyInjection.Inject)(_application.Application)], Scene.prototype, "pixi", void 0);
__decorate([(0, _dependencyInjection.Inject)(_resources.Resources)], Scene.prototype, "resouces", void 0);