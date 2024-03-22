"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var Resources_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
const PIXI = __importStar(require("pixi.js"));
const latermom_1 = require("latermom");
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
let Resources = Resources_1 = class Resources {
    constructor(path = '', cacheSize = 64) {
        this.cache = new latermom_1.Cache(async (url) => {
            try {
                return await Resources_1.loadResource(`${path}${url}`);
            }
            catch (err) {
                console.error(err);
            }
        }, cacheSize);
    }
    static loadResource(path) {
        const { loader } = PIXI.Assets;
        return loader.load(path);
    }
    static loadResources(resources) {
        const promises = resources.map((path) => PIXI.Assets.load(path));
        return new Promise((resolve) => {
            Promise.all(promises).then((resolved) => resolve(resolved.reduce((result, loaded, index) => (Object.assign(Object.assign({}, result), { [resources[index]]: loaded })), {})));
        });
    }
    async get(url) {
        return this.cache.get(url);
    }
};
Resources = Resources_1 = __decorate([
    dependency_injection_1.Injectable
], Resources);
exports.Resources = Resources;
