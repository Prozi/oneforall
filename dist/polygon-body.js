'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PolygonBody = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _detectCollisions = require('detect-collisions');

var _ = require('.');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PolygonBody = exports.PolygonBody = function (_Polygon) {
    _inherits(PolygonBody, _Polygon);

    function PolygonBody(gameObject, points) {
        _classCallCheck(this, PolygonBody);

        var _this = _possibleConstructorReturn(this, (PolygonBody.__proto__ || Object.getPrototypeOf(PolygonBody)).call(this, gameObject, points.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            return { x: x, y: y };
        })));

        _this.name = 'PolygonBody';
        _this.update$ = new _rxjs.Subject();
        _this.destroy$ = new _rxjs.Subject();
        _this.gameObject = gameObject;
        _this.gameObject.addComponent(_this);
        return _this;
    }

    _createClass(PolygonBody, [{
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

    return PolygonBody;
}(_detectCollisions.Polygon);