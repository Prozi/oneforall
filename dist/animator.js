import * as PIXI from 'pixi.js';
import { Container } from './container';
export class Animator extends Container {
    /**
     * create animated container
     * @param animations
     * @param textures
     * @param radius
     */
    constructor(gameObject, data, { baseTexture }) {
        super(gameObject);
        this.name = 'Animator';
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
        const indexes = this.states
            .map((direction, index) => ({
            direction,
            index
        }))
            .filter(({ direction }) => direction.toLocaleLowerCase().includes(state))
            .map(({ index }) => index);
        // random of above candidates
        const targetIndex = indexes[Math.floor(indexes.length * Math.random())];
        this.children
            .filter((child, index) => child instanceof PIXI.AnimatedSprite &&
            child.visible &&
            index !== targetIndex)
            .forEach((child) => {
            child.visible = false;
            child.stop();
        });
        const animation = this.children[targetIndex];
        if (animation) {
            animation.loop = loop;
            animation.gotoAndPlay(0);
            animation.visible = true;
            if (!loop) {
                animation.onComplete = () => {
                    this.setState(stateWhenFinished);
                };
            }
        }
        this.animation = animation;
        this.state = state;
    }
}
