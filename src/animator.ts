import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';

import { Container } from './container';
import { GameObject } from './game-object';
import { StateMachine } from './state-machine';

export interface AnimatorData {
  animations: Record<string, number[]>;
  cols: number;
  rows: number;
  animationSpeed?: number;
  anchor?: Vector;
}

export class Animator extends Container {
  /**
   * When animation completes, it emits this subject.
   */
  readonly complete$: Subject<string> = new Subject();

  /**
   * Inner State Machine Object.
   */
  readonly stateMachine: StateMachine;

  /**
   * Each Lifecycle Object has label for pixi debugging.
   */
  label = 'Animator';

  /**
   * List of possible animations.
   */
  states: string[];

  /**
   * Pointer to currently visible animation.
   */
  animation?: PIXI.AnimatedSprite;

  /**
   * @param gameObject
   * @param options
   * @param texture
   */
  constructor(
    gameObject: GameObject,
    {
      animations,
      cols,
      rows,
      animationSpeed = 16.67,
      anchor = { x: 0.5, y: 0.5 }
    }: AnimatorData,
    { width, height, source }: PIXI.Texture
  ) {
    super(gameObject);
    this.stateMachine = new StateMachine(gameObject);

    const tileWidth = width / cols;
    const tileHeight = height / rows;
    Object.values(animations).forEach((animationFrames) => {
      const animatedSprite = new PIXI.AnimatedSprite(
        animationFrames.map((animationFrame) => {
          const frameWidth = Math.floor(animationFrame * tileWidth);
          const frame: PIXI.Rectangle = new PIXI.Rectangle(
            frameWidth % width,
            tileHeight * Math.floor(frameWidth / width),
            tileWidth,
            tileHeight
          );

          const texture: PIXI.Texture = new PIXI.Texture({ source, frame });
          texture.source.scaleMode = 'nearest';

          return { texture, time: animationSpeed };
        })
      );

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

  setScale(x = 1, y: number = x): void {
    (this.children as PIXI.AnimatedSprite[]).forEach(
      (child: PIXI.AnimatedSprite) => {
        child.scale.set(x, y);
      }
    );
  }

  getAnimationIndex(state: string): number {
    const exactIndex: number = this.getExactStateIndex(state);

    return exactIndex !== -1 ? exactIndex : this.getFuzzyStateIndex(state);
  }

  setAnimation(animation: PIXI.AnimatedSprite, loop: boolean): void {
    if (animation === this.animation) {
      return;
    }

    const children = this.children.filter(
      (child: PIXI.AnimatedSprite) =>
        child instanceof PIXI.AnimatedSprite && child !== animation
    );

    children.forEach((child: PIXI.AnimatedSprite) => {
      child.visible = false;
      child.stop();
    });

    animation.loop = loop;
    animation.gotoAndPlay(0);
    animation.visible = true;
    this.animation = animation;
  }

  setState(state: string, loop = true, stateWhenFinished = 'idle'): string {
    const index: number = this.getAnimationIndex(state);
    if (index === -1) {
      return '';
    }

    const next = this.states[index];
    if (!this.stateMachine.setState(next)) {
      return '';
    }

    const animation = this.children[index] as PIXI.AnimatedSprite;
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

  private getExactStateIndex(state: string): number {
    return this.states.indexOf(state);
  }

  private getFuzzyStateIndex(state: string): number {
    const indexes: number[] = this.states
      .map((direction: string, index: number) => ({
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
