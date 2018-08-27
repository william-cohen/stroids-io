/* eslint no-unused-vars: */

'use strict';

const Vector2 = require('../util/Vector2');


/**
 * Hermite Spline (cubic) implementation
 * @param {Vector2} x0 Start position
 * @param {Vector2} v0 Start velocity
 * @param {Vector2} x1 Final position
 * @param {Vector2} v1 Final velocity
 * @param {Number} t Time proportion
 */
function hermiteSpline(x0, v0, x1, v1, t) {
    let p = x0.scale(2*t*t*t - 3*t*t + 1)
        .add(v0.scale(t*t*t - 2*t*t + t))
        .add(x1.scale(-2*t*t*t + 3*t*t))
        .add(v1.scale(t*t*t - t*t));
    return p;
}

module.exports = hermiteSpline;
