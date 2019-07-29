import Vector2 from './Vector2';

export default function lerp(x0: Vector2, x1: Vector2, t: number) {
    let p = x0.add((x1.subtract(x0)).scale(t));
    return p;
}