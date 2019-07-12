class Vector2 {
    x: number;
    y: number;
    
    /**
     * Vector constructor
     * @constructor
     * @param {number} x x-value of new Vector
     * @param {number} y y-value of new Vector
     */
    constructor(x: number, y: number) {
        this.x = x + 0.0;
        this.y = y + 0.0;
    }

    /**
     * Calculates the magnitute-squared of a vector
     * @return {number}
     */
    mag2(): number {
        return (this.x*this.x + this.y*this.y);
    }

    /**
     * Calculates the magnitute of a vector
     * @return {number}
     */
    mag(): number {
        return Math.sqrt(this.mag2());
    }

    /**
     * Adds this vector to another vector. Returns new vector
     * @param {Vector2} vec The vector to add
     * @return {Vector2}
     */
    add(vec: Vector2): Vector2 {
        return new Vector2(this.x+vec.x, this.y+vec.y);
    }

    /**
     * Subtracts this vector to another vector. Returns new vector
     * @param {Vector2} vec The vector to subtract
     * @return {Vector2}
     */
    subtract(vec: Vector2): Vector2 {
        return new Vector2(this.x-vec.x, this.y-vec.y);
    }

    /**
     * Scales this vector by a constant
     * @param {number} a The scaling constant
     * @return {Vector2}
     */
    scale(a: number): Vector2 {
        return new Vector2(this.x*a, this.y*a);
    }

    /**
     * Clones this current vector
     * @return {Vector2}
     */
    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Computes the dot product with another vector
     * @param {Vector2} vec The vector to compute with
     * @return {Number}
     */
    dot(vec: Vector2): number {
        return (this.x*vec.x + this.y*vec.y);
    }

}

export default Vector2;