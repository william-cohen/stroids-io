'use strict';

class Vector2f {
    /**
     * Vector constructor
     * @constructor
     * @param {number} x x-value of new Vector
     * @param {number} y y-value of new Vector
     */
    constructor(x, y) {
        this.x = x + 0.0;
        this.y = y + 0.0;
    }

    /**
     * Calculates the magnitute-squared of a vector
     * @return {number}
     */
    mag2() {
        return (this.x*this.x + this.y*this.y);
    }

    /**
     * Calculates the magnitute of a vector
     * @return {number}
     */
    mag() {
        return Math.sqrt(this.mag2());
    }

    /**
     * Adds this vector to another vector. Returns new vector
     * @param {Vector2f} vec The vector to add
     * @return {Vector2f}
     */
    add(vec) {
        return new Vector2f(this.x+vec.x, this.y+vec.y);
    }

    /**
     * Subtracts this vector to another vector. Returns new vector
     * @param {Vector2f} vec The vector to subtract
     * @return {Vector2f}
     */
    subtract(vec) {
        return new Vector2f(this.x-vec.x, this.y-vec.y);
    }

    /**
     * Scales this vector by a constant
     * @param {number} a The scaling constant
     * @return {Vector2f}
     */
    scale(a) {
        return new Vector2f(this.x*a, this.y*a);
    }

    /**
     * Clones this current vector
     * @return {Vector2f}
     */
    clone() {
        return new Vector2f(this.x, this.y);
    }

}

module.exports = Vector2f;
