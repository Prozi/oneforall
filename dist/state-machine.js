'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StateMachine = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _rxjs = require('rxjs');

var _component = require('./component');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StateMachine = exports.StateMachine = function (_Component) {
    _inherits(StateMachine, _Component);

    function StateMachine(gameObject) {
        var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'INITIAL_STATE';

        _classCallCheck(this, StateMachine);

        var _this = _possibleConstructorReturn(this, (StateMachine.__proto__ || Object.getPrototypeOf(StateMachine)).call(this, gameObject));

        _this.name = 'StateMachine';
        _this.state$ = new _rxjs.Subject();
        _this.change$ = new _rxjs.Subject();
        _this.validators = {};
        _this.state = initialState;
        return _this;
    }

    _createClass(StateMachine, [{
        key: 'setState',
        value: function setState(newState) {
            if (!this.validateStateChange(newState)) {
                return;
            }
            this.change$.next([this.state, newState]);
            this.state = newState;
            this.state$.next(this.state);
        }
    }, {
        key: 'setValidators',
        value: function setValidators(fromState, validators) {
            this.validators[fromState] = validators;
        }
    }, {
        key: 'getValidators',
        value: function getValidators(fromState) {
            return this.validators[fromState];
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.state$.complete();
            this.change$.complete();
            _get(StateMachine.prototype.__proto__ || Object.getPrototypeOf(StateMachine.prototype), 'destroy', this).call(this);
        }
    }, {
        key: 'validateStateChange',
        value: function validateStateChange(newState) {
            if (!this.state) {
                return true;
            }
            var fromAllStates = this.validators['*'] || [];
            var fromCurrentState = this.validators[this.state] || [];
            return [].concat(_toConsumableArray(fromAllStates), _toConsumableArray(fromCurrentState)).every(function (validator) {
                return validator(newState);
            });
        }
    }]);

    return StateMachine;
}(_component.Component);