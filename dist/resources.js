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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Resources_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
const latermom_1 = __importDefault(require("latermom"));
const PIXI = __importStar(require("pixi.js"));
const dependency_injection_1 = require("@jacekpietal/dependency-injection");
let Resources = Resources_1 = class Resources {
    constructor(path = '') {
        this.cache = new latermom_1.default((url) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Resources_1.loadResource(`${path}${url}`);
            }
            catch (err) {
                console.error(err);
            }
        }));
    }
    static loadResource(path) {
        const resource = PIXI.Loader.shared.resources[path];
        if (resource) {
            return Promise.resolve(resource);
        }
        return new Promise((resolve) => {
            const loader = new PIXI.Loader();
            loader.add(path);
            loader.load(() => {
                Object.assign(PIXI.Loader.shared.resources, {
                    [path]: loader.resources[path]
                });
                resolve(loader.resources[path]);
            });
        });
    }
    static loadResources(resources) {
        return new Promise((resolve) => {
            const loader = new PIXI.Loader();
            loader.add(resources);
            loader.load(() => {
                Object.assign(PIXI.Loader.shared.resources, loader.resources);
                resolve(PIXI.Loader.shared.resources);
            });
        });
    }
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cache.get(url);
        });
    }
};
Resources = Resources_1 = __decorate([
    dependency_injection_1.Injectable
], Resources);
exports.Resources = Resources;
