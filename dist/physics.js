var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Physics_1;
import { Collisions } from 'detect-collisions';
import { Injectable } from '@jacekpietal/dependency-injection';
import { Subject } from 'rxjs';
let Physics = Physics_1 = class Physics {
    constructor() {
        this.system = new Collisions();
        this.result = this.system.createResult();
    }
    static pushBack(body, { overlap, overlap_x, overlap_y }) {
        if (body.isStatic) {
            console.warn('pushBack on static body', body);
        }
        body.x -= overlap * overlap_x;
        body.y -= overlap * overlap_y;
    }
    get bodies() {
        return this.system['_bvh']._bodies;
    }
    createPolygon(x, y, points) {
        return this.system.createPolygon(x, y, points);
    }
    createCircle(x, y, radius) {
        if (radius <= 0) {
            throw new Error('Radius must be greater than 0');
        }
        return this.system.createCircle(x, y, radius);
    }
    remove(body) {
        this.system.remove(body);
    }
    update(pushBack = true) {
        if (!pushBack) {
            return;
        }
        Array.from(this.bodies).forEach((body) => {
            if (body.isStatic || body.isTrigger) {
                return;
            }
            this.detectCollisions(body).forEach((result) => {
                Physics_1.pushBack(body, result);
                Physics_1.collision$.next([
                    result.a.gameObject,
                    result.b.gameObject
                ]);
            });
        });
        this.system.update();
    }
    detectCollisions(input, tolerance = 0.001) {
        // removed collider doesnt collide
        if (!input._bvh) {
            return [];
        }
        return input
            .potentials()
            .map((body) => {
            if (body.isTrigger) {
                return;
            }
            if (input.collides(body, this.result) &&
                Math.abs(this.result.overlap) > tolerance) {
                const { collision, a, b, a_in_b, b_in_a, overlap, overlap_x, overlap_y } = this.result;
                return {
                    collision,
                    a,
                    b,
                    a_in_b,
                    b_in_a,
                    overlap,
                    overlap_x,
                    overlap_y
                };
            }
            return;
        })
            .filter((result) => !!result);
    }
};
Physics.collision$ = new Subject();
Physics = Physics_1 = __decorate([
    Injectable
], Physics);
export { Physics };
