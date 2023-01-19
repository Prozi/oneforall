import * as PIXI from "pixi.js";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";
import { Container } from "./container";

export interface IAnimatorData {
  animations: { [name: string]: (number | string)[] };
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
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
    data: IAnimatorData,
    { baseTexture }: PIXI.Texture
  ) {
    super(gameObject);

    Object.values(data.animations).forEach((frames) => {
      const animatedSprite = new PIXI.AnimatedSprite(
        frames.map((frame: number) => {
          const x = (frame * data.tilewidth) % data.width;
          const y =
            Math.floor((frame * data.tilewidth) / data.width) * data.tileheight;
          const rect: PIXI.Rectangle = new PIXI.Rectangle(
            x,
            y,
            data.tilewidth,
            data.tileheight
          );
          const texture: PIXI.Texture = new PIXI.Texture(baseTexture, rect);

          texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

          return { texture, time: 16.67 };
        })
      );

      animatedSprite.animationSpeed = 0.1;
      animatedSprite.anchor.set(0.5, 0.5);

      this.addChild(animatedSprite);
    }, {});

    this.states = Object.keys(data.animations);
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

  setAnimation(animation: PIXI.AnimatedSprite): void {
    (this.children as PIXI.AnimatedSprite[])
      .filter(
        (child: PIXI.AnimatedSprite) =>
          child instanceof PIXI.AnimatedSprite && child !== animation
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
