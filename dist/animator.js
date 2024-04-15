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
const Subject_1 = require("rxjs/internal/Subject");
const container_1 = require("./container");
const state_machine_1 = require("./state-machine");
class Animator extends container_1.Container {
    /**
     * @param gameObject
     * @param options
     * @param texture
     */
    constructor(gameObject, { animations, cols, rows, animationSpeed = 16.67, anchor = { x: 0.5, y: 0.5 } }, { width, height, source }) {
        super(gameObject);
        /**
         * When animation completes, it emits this subject.
         */
        this.complete$ = new Subject_1.Subject();
        /**
         * Each Lifecycle Object has label for pixi debugging.
         */
        this.label = 'Animator';
        this.stateMachine = new state_machine_1.StateMachine(gameObject);
        const tileWidth = width / cols;
        const tileHeight = height / rows;
        Object.values(animations).forEach((animationFrames) => {
            const animatedSprite = new PIXI.AnimatedSprite(animationFrames.map((animationFrame) => {
                const frameWidth = Math.floor(animationFrame * tileWidth);
                const frame = new PIXI.Rectangle(frameWidth % width, tileHeight * Math.floor(frameWidth / width), tileWidth, tileHeight);
                const texture = new PIXI.Texture({ source, frame });
                texture.source.scaleMode = 'nearest';
                return { texture, time: animationSpeed };
            }));
            animatedSprite.anchor.set(anchor.x, anchor.y);
            this.addChild(animatedSprite);
        });
        this.states = Object.keys(animations);
    }
    /**
     * Reference to inner State Machine's state.
     */
    get state() {
        return this.stateMachine.state;
    }
    /**
     * Reference to inner State Machine's state$ Subject.
     */
    get state$() {
        return this.stateMachine.state$;
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
    setAnimation(animation, loop) {
        if (animation === this.animation) {
            return;
        }
        const children = this.children.filter((child) => child instanceof PIXI.AnimatedSprite && child !== animation);
        children.forEach((child) => {
            child.visible = false;
            child.stop();
        });
        animation.loop = loop;
        animation.gotoAndPlay(0);
        animation.visible = true;
        this.animation = animation;
    }
    setState(state, loop = true, stateWhenFinished = 'idle') {
        if (state === this.state) {
            return state;
        }
        const index = this.getAnimationIndex(state);
        if (index === -1) {
            return '';
        }
        const next = this.states[index];
        if (!this.stateMachine.setState(next)) {
            return '';
        }
        const animation = this.children[index];
        if (!loop && stateWhenFinished) {
            animation.onComplete = () => {
                animation.onComplete = null;
                this.complete$.next(next);
                this.setState(stateWhenFinished);
            };
        }
        this.setAnimation(animation, loop);
        return next;
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
