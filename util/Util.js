class Util {
    constructor() {

    }

    static angleDelta(theta1, theta2) {
        let d = Math.abs(theta1 - theta2);
        let r = d > Math.PI ? 2*Math.PI - d : d;
        let sign = (theta1 - theta2 >= 0 && theta1 - theta2 <= Math.PI)
            || (theta1 - theta2 <=-Math.PI && theta1- theta2>= -2*Math.PI) ? 1 : -1;

        return r*sign;
    }

}

module.exports = Util;
