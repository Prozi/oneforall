import * as PIXI from "pixi.js";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";
import { Container } from "./container";

export interface AnimatorData {
  animations: { [name: string]: (number | string)[] };
  cols: number;
  rows: number;
  animationSpeed?: number;
  anchor?: { x: number; y: number };
}

export class Animator extends Container {
  readonly name: string = "Animator";
  readonly complete$: Subject<string> = new Subject();
  readonly state$: BehaviorSubject<string> = new BehaviorSubject("");

  states: string[];
  state?: string;
  animation?: PIXI.AnimatedSprite;

  constructor(
    gameObject: GameObject,
    {
      animations,
      cols,
      rows,
      animationSpeed = 200,
      anchor = { x: 0.5, y: 0.5 },
    }: AnimatorData,
    { width, height, source }: PIXI.Texture,
  ) {
    super(gameObject);

    const tilewidth = width / cols;
    const tileheight = height / rows;

    Object.values(animations).forEach((frames) => {
      const animatedSprite = new PIXI.AnimatedSprite(
        frames.map((f: number) => {
          const x = (f * tilewidth) % width;
          const y = Math.floor((f * tilewidth) / width) * tileheight;
          const frame: PIXI.Rectangle = new PIXI.Rectangle(
            x,
            y,
            tilewidth,
            tileheight,
          );
          const texture: PIXI.Texture = new PIXI.Texture({
            source,
            frame,
          });

          texture.source.scaleMode = PIXI.SCALE_MODES.NEAREST;

          return { texture, time: animationSpeed };
        }),
      );

      animatedSprite.anchor.set(anchor.x, anchor.y);

      this.addChild(animatedSprite);
    }, {});

    this.states = Object.keys(animations);
  }

  setScale(x = 1, y: number = x): void {
    (this.children as PIXI.AnimatedSprite[]).forEach(
      (child: PIXI.AnimatedSprite) => {
        child.scale.set(x, y);
      },
    );
  }

  getAnimationIndex(state: string): number {
    const exactIndex: number = this.getExactStateIndex(state);

    return exactIndex !== -1 ? exactIndex : this.getFuzzyStateIndex(state);
  }

  setAnimation(animation: PIXI.AnimatedSprite): void {
    (this.children as PIXI.AnimatedSprite[])
      .filter(
        (child: PIXI.AnimatedSprite) =>
          child instanceof PIXI.AnimatedSprite && child !== animation,
      )
      .forEach((child: PIXI.AnimatedSprite) => {
        child.visible = false;
        child.stop();
      });

    this.animation = animation;
  }

  setState(state: string, loop = true, stateWhenFinished = "idle"): string {
    const index: number = this.getAnimationIndex(state);
    const animation = this.children[index] as PIXI.AnimatedSprite;

    if (!animation || animation === this.animation) {
      return "";
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

  private getExactStateIndex(state: string): number {
    return this.states.indexOf(state);
  }

  private getFuzzyStateIndex(state: string): number {
    const indexes: number[] = this.states
      .map((direction: string, index: number) => ({
        direction,
        index,
      }))
      .filter(({ direction }) => direction.toLocaleLowerCase().includes(state))
      .map(({ index }) => index);

    // random of above candidates
    return indexes.length
      ? indexes[Math.floor(indexes.length * Math.random())]
      : -1;
  }
}
