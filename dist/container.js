'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Container = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _pixi = require('pixi.js');

var PIXI = _interopRequireWildcard(_pixi);

var _rxjs = require('rxjs');

var _component = require('./component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = exports.Container = function (_PIXI$Container) {
    _inherits(Container, _PIXI$Container);

    function Container(gameObject) {
        _classCallCheck(this, Container);

        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

        _this.name = 'Container';
        _this.update$ = new _rxjs.Subject();
        _this.destroy$ = new _rxjs.Subject();
        _this.gameObject = gameObject;
        _this.gameObject.addComponent(_this);
        return _this;
    }

    _createClass(Container, [{
        key: 'update',
        value: function update() {
            var _a;
            if (!this.parent) {
                (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.addChild(this);
            }
            this.x = this.gameObject.x;
            this.y = this.gameObject.y;
            _component.Component.update(this);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _a;
            (_a = this.gameObject.parent) === null || _a === void 0 ? void 0 : _a.stage.removeChild(this);
            _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'destroy', this).call(this);
            _component.Component.destroy(this);
        }
    }]);

    return Container;
}(PIXI.Container);