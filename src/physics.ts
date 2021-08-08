import { Polygon, Collisions, Result, Body, Circle } from 'detect-collisions'
import { Injectable } from '@jacekpietal/dependency-injection'
import { GameObject } from './game-object'
import { Subject } from 'rxjs'

export interface IBody extends Body {
  isTrigger?: boolean
}

@Injectable
export class Physics {
  static readonly collision$: Subject<GameObject> = new Subject()

  readonly system: Collisions = new Collisions()
  readonly result: Result = this.system.createResult()

  static pushBack(
    body: Body,
    { overlap, overlap_x, overlap_y }: Partial<Result>
  ): void {
    body.x -= overlap * overlap_x
    body.y -= overlap * overlap_y
  }

  get bodies(): Body[] {
    return this.system['_bvh']._bodies
  }

  createPolygon(x: number, y: number, points: number[][]): Polygon {
    return this.system.createPolygon(x, y, points)
  }

  createCircle(x: number, y: number, radius: number): Circle {
    if (radius <= 0) {
      throw new Error('Radius must be greater than 0')
    }

    return this.system.createCircle(x, y, radius)
  }

  remove(body: Body): void {
    this.system.remove(body)
  }

  update(pushBack: boolean = true): void {
    this.system.update()

    if (!pushBack) {
      return
    }

    Array.from(this.bodies).forEach((body: Body | any) => {
      this.detectCollisions(body).forEach((result: Partial<Result>) => {
        Physics.pushBack(body, result)

        Physics.collision$.next(body.gameObject)
      })
    })
  }

  detectCollisions(input: Body, tolerance = 0.001): Partial<Result>[] {
    return input
      .potentials()
      .map((body: IBody) => {
        if (body.isTrigger) {
          return
        }

        if (input.collides(body, this.result)) {
          const { overlap, overlap_x, overlap_y } = this.result

          if (Math.abs(overlap) > tolerance) {
            return { overlap, overlap_x, overlap_y }
          }
        }

        return
      })
      .filter((result: Result | undefined) => !!result)
  }
}
