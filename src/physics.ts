import { Polygon, Collisions, Result, Body } from 'detect-collisions'
import { Singleton } from 'ts-dependency-injection'

export interface IBody extends Body {
  isTrigger?: boolean
}

@Singleton
export class Physics {
  readonly system: Collisions = new Collisions()
  readonly result: Result = this.system.createResult()

  createPolygon(x: number, y: number, points: number[][]): Polygon {
    return this.system.createPolygon(x, y, points)
  }

  createCircle(x: number, y: number, radius: number): Polygon {
    if (radius <= 0) {
      throw new Error('Radius must be greater than 0')
    }

    return this.createPolygon(x, y, this.createCirclePoints(radius))
  }

  remove(body: Body): void {
    this.system.remove(body)
  }

  update(): void {
    this.system.update()
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

  pushBack(
    body: Body,
    { overlap, overlap_x, overlap_y }: Partial<Result>
  ): void {
    body.x -= overlap * overlap_x
    body.y -= overlap * overlap_y
  }

  private createCirclePoints(radius: number): number[][] {
    const steps: number = Math.max(5, radius / 2)
    const points: number[][] = []

    for (let i = 0; i < steps; i++) {
      const r = (2 * Math.PI * i) / steps

      points.push([Math.cos(r) * radius, Math.sin(r) * radius])
    }

    return points
  }
}
