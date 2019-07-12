import Vector2 from './Vector2';


/**
 * Hermite Spline (cubic) implementation
 * @param {Vector2} x0 Start position
 * @param {Vector2} v0 Start velocity
 * @param {Vector2} x1 Final position
 * @param {Vector2} v1 Final velocity
 * @param {number} t Time proportion
 */
function hermiteSpline(x0: Vector2, v0: Vector2, x1: Vector2, v1: Vector2, t: number) {
    let p = x0.scale(2*t*t*t - 3*t*t + 1)
        .add(v0.scale(t*t*t - 2*t*t + t))
        .add(x1.scale(-2*t*t*t + 3*t*t))
        .add(v1.scale(t*t*t - t*t));
    return p;
}

export default hermiteSpline;
