const fs = require('fs');

const lerp = require('./util/HermiteSpline');
const Vector2 = require('./util/Vector2');

const x0 = new Vector2(1, 2);
const v0 = new Vector2(10, -10);
const x1 = new Vector2(40, 30);
const v1 = new Vector2(10, 10);


for (let i = 0; i < 6; i++) {
    let t = i/6;
    let p = lerp(x0, v0, x1, v1, t);
    let dat = p.x + ', ' + p.y + '\n';

    fs.appendFileSync('test.csv', dat);
}
