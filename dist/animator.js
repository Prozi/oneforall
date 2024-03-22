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
const BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
const Subject_1 = require("rxjs/internal/Subject");
const container_1 = require("./container");
class Animator extends container_1.Container {
    constructor(gameObject, { animations, cols, rows, animationSpeed = 200, anchor = { x: 0.5, y: 0.5 } }, { width, height, source }) {
        super(gameObject);
        this.label = 'Animator';
        this.complete$ = new Subject_1.Subject();
        this.state$ = new BehaviorSubject_1.BehaviorSubject('');
        const tileWidth = width / cols;
        const tileHeight = height / rows;
        Object.values(animations).forEach((animationFrames) => {
            const animatedSprite = new PIXI.AnimatedSprite(animationFrames.map((animationFrameInput) => {
                const animationFrame = typeof animationFrameInput === 'number'
                    ? animationFrameInput
                    : parseInt(animationFrameInput, 10);
                const frameWidth = Math.floor(animationFrame * tileWidth);
                const frame = new PIXI.Rectangle(frameWidth % width, tileHeight * Math.floor(frameWidth / width), tileWidth, tileHeight);
                const texture = new PIXI.Texture({
                    source,
                    frame
                });
                texture.source.scaleMode = 'nearest';
                return { texture, time: animationSpeed };
            }));
            animatedSprite.anchor.set(anchor.x, anchor.y);
            this.addChild(animatedSprite);
        });
        this.states = Object.keys(animations);
    }
    setScale(x = 1, y = x) {
        this.children.forEach((child) => {
            child.scale.set(x, y);
        });
    }
    getAnimationIndex(state) {
        const exactIndex = this.getExactStateIndex(state);
        return exactIndex !== -1 ? exactIndex : this.getFuzzyStateIndex(state);
    }
    setAnimation(animation) {
        const children = this.children.filter((child) => child instanceof PIXI.AnimatedSprite && child !== animation);
        children.forEach((child) => {
            child.visible = false;
            child.stop();
        });
        this.animation = animation;
    }
    setState(state, loop = true, stateWhenFinished = 'idle') {
        const index = this.getAnimationIndex(state);
        const animation = this.children[index];
        if (!animation || animation === this.animation) {
            return '';
        }
        this.setAnimation(animation);
        animation.loop = loop;
        animation.gotoAndPlay(0);
        animation.visible = true;
        if (!loop && stateWhenFinished) {
            animation.onComplete = () => {
                animation.onComplete = null;
                this.complete$.next(this.state);
                // exact as target state before
                if (this.state === this.states[index]) {
                    this.setState(stateWhenFinished);
                }
            };
        }
        this.state = this.states[index];
        this.state$.next(this.state);
        // return exactly the state (maybe fuzzy)
        return this.states[index];
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
        return indexes.length
            ? indexes[Math.floor(indexes.length * Math.random())]
            : -1;
    }
}
exports.Animator = Animator;
