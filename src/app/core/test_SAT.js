const { SAT } = require("./objectcrash");
const main = async () => {
    let sat = new SAT();
    let obj1 = {
        x: 0,
        y: 0,
        width: 3,
        height: 3,
        angle: 0
    };
    let obj2 = {
        x: 4,
        y: 4,
        width: 3,
        height: 3,
        angle: Math.PI / 2
    }
    console.log(sat.collide(obj1, obj2));
}
main();