'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GameObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _component = require('./component');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameObject = exports.GameObject = function () {
    function GameObject() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'GameObject';
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, GameObject);

        this.update$ = new _rxjs.Subject();
        this.destroy$ = new _rxjs.Subject();
        this.components = new Set();
        this.components$ = new _rxjs.Subject();
        this.name = name;
        this.x = x;
        this.y = y;
    }

    _createClass(GameObject, [{
        key: 'update',
        value: function update() {
            Array.from(this.components.values()).forEach(function (component) {
                return component.update();
            });
            _component.Lifecycle.update(this);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            var _this = this;

            Array.from(this.components.values()).forEach(function (component) {
                return _this.removeComponent(component);
            });
            _component.Lifecycle.destroy(this);
        }
    }, {
        key: 'addComponent',
        value: function addComponent(component) {
            var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.key || '';

            if (this.components.has(component)) {
                return;
            }
            this.components.add(component);
            this.components$.next();
            if (key) {
                component.key = key;
                this[key] = component;
            }
            return component;
        }
    }, {
        key: 'removeComponent',
        value: function removeComponent(component) {
            var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : component.key || '';

            if (!this.components.has(component)) {
                return;
            }
            if (key && this[key]) {
                this[key] = null;
            }
            this.components.delete(component);
            this.components$.next();
        }
    }, {
        key: 'getComponentOfType',
        value: function getComponentOfType(type) {
            return Array.from(this.components.values()).find(function (_ref) {
                var name = _ref.name;
                return name === type;
            });
        }
    }, {
        key: 'getComponentsOfType',
        value: function getComponentsOfType(type) {
            return Array.from(this.components.values()).filter(function (_ref2) {
                var name = _ref2.name;
                return name === type;
            });
        }
    }], [{
        key: 'instantiate',
        value: async function instantiate(prefab) {
            return await prefab.instantiate();
        }
    }]);

    return GameObject;
}();