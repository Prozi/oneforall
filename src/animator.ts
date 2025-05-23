import * as PIXI from 'pixi.js';

import { Lifecycle, LifecycleParent, LifecycleProps } from './lifecycle';

import { GameObject } from './game-object';
import { StateMachine } from './state-machine';
import { Subject } from 'rxjs/internal/Subject';
import { Vector } from 'detect-collisions';
import { PIXITexture } from './model';

export interface AnimatorData {
  animations: Record<string, number[]>;
  cols: number;
  rows: number;
  animationSpeed?: number;
  anchor?: Vector;
}

export class Animator extends PIXI.Container implements LifecycleProps {
  /**
   * When Lifecycle Object is updated, it emits this subject.
   * Along with updating his children, which in turn behave the same.
   */
  readonly update$: Subject<number> = new Subject();

  /**
   * When Lifecycle Object is destroyed, it emits and closes this subject.
   * Along with destroying his children, which in turn behave the same.
   */
  readonly destroy$: Subject<void> = new Subject();

  /**
   * When animation completes, it emits this subject.
   */
  readonly complete$: Subject<string> = new Subject();

  /**
   * Inner State Machine Object.
   */
  readonly stateMachine: StateMachine;

  /**
   * Animator has sprite container for animations.
   */
  readonly sprite: PIXI.Container;

  /**
   * Parent GameObject is assigned at creation.
   */
  gameObject: LifecycleParent;

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
   * @param animatorData
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
    { width, height, source, baseTexture }: PIXITexture
  ) {
    super();

    gameObject.addChild(this);
    this.stateMachine = new StateMachine(gameObject);

    const tileWidth = width / cols;
    const tileHeight = height / rows;

    Object.entries(animations).forEach(([animation, animationFrames]) => {
      const animatedSprite = new PIXI.AnimatedSprite(
        animationFrames.map((animationFrame) => {
          const frameWidth = Math.floor(animationFrame * tileWidth);
          const frame: PIXI.Rectangle = new PIXI.Rectangle(
            frameWidth % width,
            tileHeight * Math.floor(frameWidth / width),
            tileWidth,
            tileHeight
          );

          const texture = (
            source
              ? new PIXI.Texture({
                  source,
                  frame
                } as any)
              : new (PIXI.Texture as any)(baseTexture, frame)
          ) as PIXITexture;

          if ('source' in texture) {
            texture.source.scaleMode = 'nearest';
          }

          if ('baseTexture' in texture) {
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
          }

          return { texture, time: animationSpeed } as PIXI.FrameObject;
        })
      );

      const nameKey = 'label' in animatedSprite ? 'label' : 'name';

      animatedSprite[nameKey] = `Animator_AnimatedSprite_${animation}`;
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

  /**
   * Reference to inner animation scale.
   */
  get scale() {
    return this.animation.scale;
  }

  /**
   * @param deltaTime = 1.0 for 60FPS
   */
  update(deltaTime: number) {
    this.x = this.gameObject.x;
    this.y = this.gameObject.y;
    Lifecycle.update(this, deltaTime);
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
    if (state === this.state) {
      return state;
    }

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

  protected getExactStateIndex(state: string): number {
    return this.states.indexOf(state);
  }

  protected getFuzzyStateIndex(state: string): number {
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
