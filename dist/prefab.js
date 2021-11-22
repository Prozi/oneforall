'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Prefab = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gameObject = require('./game-object');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Prefab = exports.Prefab = function (_GameObject) {
    _inherits(Prefab, _GameObject);

    function Prefab() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GameObject';
        var createFunction = arguments[1];

        _classCallCheck(this, Prefab);

        var _this = _possibleConstructorReturn(this, (Prefab.__proto__ || Object.getPrototypeOf(Prefab)).call(this, name, 0, 0));

        _this.createFunction = createFunction;
        return _this;
    }

    _createClass(Prefab, [{
        key: 'instantiate',
        value: async function instantiate() {
            var gameObject = new _gameObject.GameObject(this.name, this.x, this.y);
            await this.createFunction(gameObject);
            return gameObject;
        }
    }]);

    return Prefab;
}(_gameObject.GameObject);