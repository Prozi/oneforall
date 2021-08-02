var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Collisions } from 'detect-collisions';
import { Injectable } from '@jacekpietal/dependency-injection';
let Physics = class Physics {
    constructor() {
        this.system = new Collisions();
        this.result = this.system.createResult();
    }
    createPolygon(x, y, points) {
        return this.system.createPolygon(x, y, points);
    }
    createCircle(x, y, radius) {
        if (radius <= 0) {
            throw new Error('Radius must be greater than 0');
        }
        return this.createPolygon(x, y, this.createCirclePoints(radius));
    }
    remove(body) {
        this.system.remove(body);
    }
    update() {
        this.system.update();
    }
    detectCollisions(input, tolerance = 0.001) {
        return input
            .potentials()
            .map((body) => {
            if (body.isTrigger) {
                return;
            }
            if (input.collides(body, this.result)) {
                const { overlap, overlap_x, overlap_y } = this.result;
                if (Math.abs(overlap) > tolerance) {
                    return { overlap, overlap_x, overlap_y };
                }
            }
            return;
        })
            .filter((result) => !!result);
    }
    pushBack(body, { overlap, overlap_x, overlap_y }) {
        body.x -= overlap * overlap_x;
        body.y -= overlap * overlap_y;
    }
    createCirclePoints(radius) {
        const steps = Math.max(5, radius / 2);
        const points = [];
        for (let i = 0; i < steps; i++) {
            const r = (2 * Math.PI * i) / steps;
            points.push([Math.cos(r) * radius, Math.sin(r) * radius]);
        }
        return points;
    }
};
Physics = __decorate([
    Injectable
], Physics);
export { Physics };
