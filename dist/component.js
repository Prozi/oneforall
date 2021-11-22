'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Component = exports.Lifecycle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lifecycle = exports.Lifecycle = function () {
    function Lifecycle() {
        _classCallCheck(this, Lifecycle);

        this.name = 'Lifecycle';
        this.update$ = new _rxjs.Subject();
        this.destroy$ = new _rxjs.Subject();
    }

    _createClass(Lifecycle, [{
        key: 'update',
        value: function update() {
            Lifecycle.update(this);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            Lifecycle.destroy(this);
        }
    }], [{
        key: 'destroy',
        value: function destroy(lifecycle) {
            lifecycle.destroy$.next();
            lifecycle.destroy$.complete();
        }
    }, {
        key: 'update',
        value: function update(lifecycle) {
            lifecycle.update$.next();
        }
    }]);

    return Lifecycle;
}();

var Component = exports.Component = function (_Lifecycle) {
    _inherits(Component, _Lifecycle);

    function Component(gameObject) {
        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this));

        _this.name = 'Component';
        _this.gameObject = gameObject;
        _this.gameObject.addComponent(_this);
        return _this;
    }

    _createClass(Component, [{
        key: 'destroy',
        value: function destroy() {
            Component.destroy(this);
        }
    }], [{
        key: 'destroy',
        value: function destroy(component) {
            component.gameObject.removeComponent(component);
            Lifecycle.destroy(component);
        }
    }, {
        key: 'update',
        value: function update(component) {
            Lifecycle.update(component);
        }
    }]);

    return Component;
}(Lifecycle);