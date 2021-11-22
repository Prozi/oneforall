'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircleBody = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _detectCollisions = require('detect-collisions');

var _ = require('.');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircleBody = exports.CircleBody = function (_Circle) {
    _inherits(CircleBody, _Circle);

    function CircleBody(gameObject, radius) {
        _classCallCheck(this, CircleBody);

        var _this = _possibleConstructorReturn(this, (CircleBody.__proto__ || Object.getPrototypeOf(CircleBody)).call(this, gameObject, radius));

        _this.name = 'CircleBody';
        _this.update$ = new _rxjs.Subject();
        _this.destroy$ = new _rxjs.Subject();
        if (!radius) {
            throw new Error("CircleBody radius can't be 0!");
        }
        _this.gameObject = gameObject;
        _this.gameObject.addComponent(_this);
        return _this;
    }

    _createClass(CircleBody, [{
        key: 'update',
        value: function update() {
            this.gameObject.x = this.x;
            this.gameObject.y = this.y;
            _.Lifecycle.update(this);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            _.Lifecycle.destroy(this);
        }
    }, {
        key: 'x',
        get: function get() {
            return this.pos.x;
        },
        set: function set(x) {
            ;
            this.pos.x = x;
        }
    }, {
        key: 'y',
        get: function get() {
            return this.pos.y;
        },
        set: function set(y) {
            ;
            this.pos.y = y;
        }
    }]);

    return CircleBody;
}(_detectCollisions.Circle);