'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Animator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pixi = require('pixi.js');

var PIXI = _interopRequireWildcard(_pixi);

var _container = require('./container');

var _rxjs = require('rxjs');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Animator = exports.Animator = function (_Container) {
    _inherits(Animator, _Container);

    /**
     * create animated container
     * @param animations
     * @param textures
     * @param radius
     */
    function Animator(gameObject, data, _ref) {
        var baseTexture = _ref.baseTexture;

        _classCallCheck(this, Animator);

        var _this = _possibleConstructorReturn(this, (Animator.__proto__ || Object.getPrototypeOf(Animator)).call(this, gameObject));

        _this.name = 'Animator';
        _this.complete$ = new _rxjs.Subject();
        _this.state$ = new _rxjs.BehaviorSubject('');
        Object.values(data.animations).forEach(function (frames) {
            var animatedSprite = new PIXI.AnimatedSprite(frames.map(function (frame) {
                var x = frame * data.tilewidth % data.width;
                var y = Math.floor(frame * data.tilewidth / data.width) * data.tileheight;
                var rect = new PIXI.Rectangle(x, y, data.tilewidth, data.tileheight);
                var texture = new PIXI.Texture(baseTexture, rect);
                texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                return texture;
            }));
            animatedSprite.animationSpeed = 0.1;
            animatedSprite.anchor.set(0.5, 0.5);
            _this.addChild(animatedSprite);
        }, {});
        _this.states = Object.keys(data.animations);
        return _this;
    }

    _createClass(Animator, [{
        key: 'setScale',
        value: function setScale() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

            ;
            this.children.forEach(function (child) {
                child.scale.set(x, y);
            });
        }
        /**
         * set character animation
         * @param animation
         * @param loop
         * @param stateWhenFinished
         */

    }, {
        key: 'setState',
        value: function setState(state) {
            var _this2 = this;

            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var stateWhenFinished = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'idle';

            var indexes = this.states.map(function (direction, index) {
                return {
                    direction: direction,
                    index: index
                };
            }).filter(function (_ref2) {
                var direction = _ref2.direction;
                return direction.toLocaleLowerCase().includes(state);
            }).map(function (_ref3) {
                var index = _ref3.index;
                return index;
            });
            // random of above candidates
            var targetIndex = indexes[Math.floor(indexes.length * Math.random())];
            this.children.filter(function (child, index) {
                return child instanceof PIXI.AnimatedSprite && child.visible && index !== targetIndex;
            }).forEach(function (child) {
                child.visible = false;
                child.stop();
            });
            var animation = this.children[targetIndex];
            if (animation) {
                animation.loop = loop;
                animation.gotoAndPlay(0);
                animation.visible = true;
                if (!loop) {
                    animation.onComplete = function () {
                        _this2.complete$.next(_this2.state);
                        if (_this2.state === state) {
                            animation.onComplete = function () {};
                            _this2.setState(stateWhenFinished);
                        }
                    };
                }
            }
            this.animation = animation;
            this.state = state;
            this.state$.next(this.state);
        }
    }]);

    return Animator;
}(_container.Container);