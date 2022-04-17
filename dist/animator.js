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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animator = void 0;
const PIXI = __importStar(require("pixi.js"));
const container_1 = require("./container");
const rxjs_1 = require("rxjs");
class Animator extends container_1.Container {
    /**
     * create animated container
     * @param animations
     * @param textures
     * @param radius
     */
    constructor(gameObject, data, { baseTexture }) {
        super(gameObject);
        this.name = 'Animator';
        this.complete$ = new rxjs_1.Subject();
        this.state$ = new rxjs_1.BehaviorSubject('');
        Object.values(data.animations).forEach((frames) => {
            const animatedSprite = new PIXI.AnimatedSprite(frames.map((frame) => {
                const x = (frame * data.tilewidth) % data.width;
                const y = Math.floor((frame * data.tilewidth) / data.width) * data.tileheight;
                const rect = new PIXI.Rectangle(x, y, data.tilewidth, data.tileheight);
                const texture = new PIXI.Texture(baseTexture, rect);
                texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                return texture;
            }));
            animatedSprite.animationSpeed = 0.1;
            animatedSprite.anchor.set(0.5, 0.5);
            this.addChild(animatedSprite);
        }, {});
        this.states = Object.keys(data.animations);
    }
    setScale(x = 1, y = x) {
        ;
        this.children.forEach((child) => {
            child.scale.set(x, y);
        });
    }
    /**
     * set character animation
     * @param animation
     * @param loop
     * @param stateWhenFinished
     */
    setState(state, loop = true, stateWhenFinished = 'idle') {
        const exactIndex = this.getExactStateIndex(state);
        const targetIndex = exactIndex !== -1 ? exactIndex : this.getFuzzyStateIndex(state);
        this.children
            .filter((child, index) => child instanceof PIXI.AnimatedSprite &&
            child.visible &&
            index !== targetIndex)
            .forEach((child) => {
            child.visible = false;
            child.stop();
        });
        const animation = this.children[targetIndex];
        if (animation && animation !== this.animation) {
            animation.loop = loop;
            animation.gotoAndPlay(0);
            animation.visible = true;
            if (!loop) {
                animation.onComplete = () => {
                    this.complete$.next(this.state);
                    if (this.state === state) {
                        animation.onComplete = null;
                        this.setState(stateWhenFinished);
                    }
                };
            }
        }
        this.animation = animation;
        this.state = state;
        this.state$.next(this.state);
    }
    getExactStateIndex(state) {
        return this.states.indexOf(state);
    }
    getFuzzyStateIndex(state) {
        const indexes = this.states
            .map((direction, index) => ({
            direction,
            index
        }))
            .filter(({ direction }) => direction.toLocaleLowerCase().includes(state))
            .map(({ index }) => index);
        // random of above candidates
        return indexes[Math.floor(indexes.length * Math.random())];
    }
}
exports.Animator = Animator;
