import * as PIXI from 'pixi.js'
import { GameObject } from './game-object'
import { Container } from './container'
import { BehaviorSubject, Subject } from 'rxjs'

export interface IAnimatorData {
  animations: { [name: string]: (number | string)[] }
  width: number
  height: number
  tilewidth: number
  tileheight: number
}

export class Animator extends Container {
  readonly name: string = 'Animator'
  readonly complete$: Subject<string> = new Subject()
  readonly state$: BehaviorSubject<string> = new BehaviorSubject('')

  states: string[]
  state?: string
  animation?: PIXI.AnimatedSprite

  /**
   * create animated container
   * @param animations
   * @param textures
   * @param radius
   */
  constructor(
    gameObject: GameObject,
    data: IAnimatorData,
    { baseTexture }: PIXI.Texture
  ) {
    super(gameObject)

    Object.values(data.animations).forEach((frames) => {
      const animatedSprite = new PIXI.AnimatedSprite(
        frames.map((frame: number) => {
          const x = (frame * data.tilewidth) % data.width
          const y =
            Math.floor((frame * data.tilewidth) / data.width) * data.tileheight
          const rect: PIXI.Rectangle = new PIXI.Rectangle(
            x,
            y,
            data.tilewidth,
            data.tileheight
          )
          const texture: PIXI.Texture = new PIXI.Texture(baseTexture, rect)

          texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

          return texture
        })
      )

      animatedSprite.animationSpeed = 0.1
      animatedSprite.anchor.set(0.5, 0.5)

      this.addChild(animatedSprite)
    }, {})

    this.states = Object.keys(data.animations)
  }

  setScale(x = 1, y: number = x): void {
    ;(this.children as PIXI.AnimatedSprite[]).forEach(
      (child: PIXI.AnimatedSprite) => {
        child.scale.set(x, y)
      }
    )
  }

  /**
   * set character animation
   * @param animation
   * @param loop
   * @param stateWhenFinished
   */
  setState(state: string, loop = true, stateWhenFinished = 'idle'): void {
    const exactIndex: number = this.getExactStateIndex(state)
    const targetIndex: number =
      exactIndex !== -1 ? exactIndex : this.getFuzzyStateIndex(state)

    ;(this.children as PIXI.AnimatedSprite[])
      .filter(
        (child: PIXI.AnimatedSprite, index: number) =>
          child instanceof PIXI.AnimatedSprite &&
          child.visible &&
          index !== targetIndex
      )
      .forEach((child: PIXI.AnimatedSprite) => {
        child.visible = false
        child.stop()
      })

    const animation: PIXI.AnimatedSprite = this.children[
      targetIndex
    ] as PIXI.AnimatedSprite

    if (animation && animation !== this.animation) {
      animation.loop = loop
      animation.gotoAndPlay(0)
      animation.visible = true

      if (!loop) {
        animation.onComplete = () => {
          this.complete$.next(this.state)

          if (this.state === state) {
            animation.onComplete = null

            this.setState(stateWhenFinished)
          }
        }
      }
    }

    this.animation = animation
    this.state = state
    this.state$.next(this.state)
  }

  private getExactStateIndex(state: string): number {
    return this.states.indexOf(state)
  }

  private getFuzzyStateIndex(state: string): number {
    const indexes: number[] = this.states
      .map((direction: string, index: number) => ({
        direction,
        index
      }))
      .filter(({ direction }) => direction.toLocaleLowerCase().includes(state))
      .map(({ index }) => index)

    // random of above candidates
    return indexes[Math.floor(indexes.length * Math.random())]
  }
}
