import { Polygon, Collisions, Result, Body, Circle } from 'detect-collisions'
import { Injectable } from '@jacekpietal/dependency-injection'
import { GameObject } from './game-object'
import { Subject } from 'rxjs'

export interface IBody extends Body {
  isTrigger?: boolean
  isStatic?: boolean
}

@Injectable
export class Physics {
  static readonly collision$: Subject<GameObject[]> = new Subject()

  readonly system: Collisions = new Collisions()
  readonly result: Result = this.system.createResult()

  static pushBack(
    body: Body & { isStatic?: boolean },
    { overlap, overlap_x, overlap_y }: Partial<Result>
  ): void {
    if (body.isStatic) {
      console.warn('pushBack on static body', body)
    }

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
    if (!pushBack) {
      return
    }

    Array.from(this.bodies).forEach((body: Body & { [prop: string]: any }) => {
      if (body.isStatic || body.isTrigger) {
        return
      }

      this.detectCollisions(body).forEach((result: Partial<Result>) => {
        Physics.pushBack(body, result)

        Physics.collision$.next([
          (result.a as any).gameObject,
          (result.b as any).gameObject
        ])
      })
    })

    this.system.update()
  }

  detectCollisions(input: Body, tolerance = 0.001): Result[] {
    // removed collider doesnt collide
    if (!(input as any)._bvh) {
      return []
    }

    return input
      .potentials()
      .map((body: IBody) => {
        if (body.isTrigger) {
          return
        }

        if (
          input.collides(body, this.result) &&
          Math.abs(this.result.overlap) > tolerance
        ) {
          const {
            collision,
            a,
            b,
            a_in_b,
            b_in_a,
            overlap,
            overlap_x,
            overlap_y
          } = this.result

          return {
            collision,
            a,
            b,
            a_in_b,
            b_in_a,
            overlap,
            overlap_x,
            overlap_y
          }
        }

        return
      })
      .filter((result: Result | undefined) => !!result)
  }
}
