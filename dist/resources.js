"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resources = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _latermom = require("latermom");

var _latermom2 = _interopRequireDefault(_latermom);

var _pixi = require("pixi.js");

var PIXI = _interopRequireWildcard(_pixi);

var _dependencyInjection = require("@jacekpietal/dependency-injection");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = undefined && undefined.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Resources_1;

var Resources = Resources_1 = function () {
    function Resources() {
        var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        _classCallCheck(this, Resources);

        this.cache = new _latermom2.default(async function (url) {
            try {
                return await Resources_1.loadResource("" + path + url);
            } catch (err) {
                console.error(err);
            }
        });
    }

    _createClass(Resources, [{
        key: "get",
        value: async function get(url) {
            return this.cache.get(url);
        }
    }], [{
        key: "loadResource",
        value: function loadResource(path) {
            var resource = PIXI.Loader.shared.resources[path];
            if (resource) {
                return Promise.resolve(resource);
            }
            return new Promise(function (resolve) {
                var loader = new PIXI.Loader();
                loader.add(path);
                loader.load(function () {
                    Object.assign(PIXI.Loader.shared.resources, _defineProperty({}, path, loader.resources[path]));
                    resolve(loader.resources[path]);
                });
            });
        }
    }, {
        key: "loadResources",
        value: function loadResources(resources) {
            return new Promise(function (resolve) {
                var loader = new PIXI.Loader();
                loader.add(resources);
                loader.load(function () {
                    Object.assign(PIXI.Loader.shared.resources, loader.resources);
                    resolve(PIXI.Loader.shared.resources);
                });
            });
        }
    }]);

    return Resources;
}();
exports.Resources = Resources = Resources_1 = __decorate([_dependencyInjection.Injectable], Resources);
exports.Resources = Resources;