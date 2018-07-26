'use strict';

class Vector2f {
    /**
     * Vector constructor
     * @constructor
     * @param x x-value of new Vector
     * @param y y-value of new Vector
     */
    constructor(x, y) {
        this.x = x + 0.0;
        this.y = y + 0.0;
    }

    mag2() {
        return (this.x*this.x + this.y*this.y);
    }

    mag() {
        return Math.sqrt(this.mag2());
    }

    add(vec) {
        return new Vector2f(this.x+vec.x, this.y+vec.y);
    }

    subtract(vec) {
        return new Vector2f(this.x-vec.x, this.y-vec.y);
    }

    scale(a) {
        return new Vector2f(this.x*a, this.y*a);
    }

}

module.exports = Vector2f;
