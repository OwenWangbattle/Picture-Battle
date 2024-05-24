const { my2DBinarySearch } = require("./bs2d");
const { my2DRangeTree } = require("./rt2d");
const { myBrute } = require("./brute");

const { generateRandomPoints, generateRandonRange } = require("./utils");

const tmp = [];

const test_once = (size, length, query_st, myClass, debug) => {
    const points = debug ? tmp : generateRandomPoints(size, length, false);

    const query = query_st === "random" ? generateRandonRange(size) : query_st;

    if (debug) console.log(points);
    if (debug) console.log(query);

    const myTree = new myClass(points);

    const brute = new myBrute(points);

    const exist = myTree.queryExist(query);
    if (exist !== brute.queryExist(query)) {
        console.log("queryExist: wrong answer!");
        return false;
    }

    if (myTree.queryBottomY(query)?.y !== brute.queryBottomY(query)?.y) {
        console.log("queryBottomY: wrong answer!");
        return false;
    }
    if (myTree.queryTopY(query)?.y !== brute.queryTopY(query)?.y) {
        console.log("queryTopY: wrong answer!");
        return false;
    }
    if (myTree.queryLeftX(query)?.x !== brute.queryLeftX(query)?.x) {
        console.log("queryLeftX: wrong answer!");
        const m = myTree.queryLeftX(query);
        const a = brute.queryLeftX(query);
        console.log(query);
        console.log(`my answer: ${m ? m.x + ", " + m.y : "null"}`);
        console.log(`correct answer: ${a ? a.x + ", " + a.y : "null"}`);
        return false;
    }
    if (myTree.queryRightX(query)?.x !== brute.queryRightX(query)?.x) {
        console.log("queryRightX: wrong answer!");
        const m = myTree.queryRightX(query);
        const a = brute.queryRightX(query);
        console.log(query);
        console.log(`my answer: ${m ? m.x + ", " + m.y : "null"}`);
        console.log(`correct answer: ${a ? a.x + ", " + a.y : "null"}`);
        return false;
    }

    const result = myTree.queryAll(query);

    if (debug) console.log(result.sort((a, b) => a.x - b.x));

    const verify = (result) => {
        const xLeft = query.topLeft.x;
        const xRight = query.bottomRight.x;
        const yTop = query.topLeft.y;
        const yBottom = query.bottomRight.y;

        for (const point of result) {
            if (
                !(
                    point.x >= xLeft &&
                    point.x <= xRight &&
                    point.y >= yTop &&
                    point.y <= yBottom
                )
            )
                return false;
        }

        const ans = brute.queryAll(query);
        if (debug) {
            console.log("ans:");
            console.log(ans.sort((a, b) => a.x - b.x));
        }
        if (ans.length !== result.length) return false;

        return true;
    };

    if (!verify(result)) {
        if (!debug) {
            console.log("queryAll: wrong answer!");
            console.log(points);
            console.log(query);
            console.log(result);
            console.log(brute.queryAll(query));
            myTree.print();
        }
        return false;
    }

    return true;
};

const run_test = (config, myClass) => {
    const size = config.size || 20;
    const length = config.length || 10;
    const times = config.times || 10;
    const batch = config.batch || 1;
    const query = config.query || {
        topLeft: {
            x: 0,
            y: 0,
        },
        bottomRight: {
            x: size,
            y: size,
        },
    };

    console.log(`running tests...`);
    console.log(`size: ${size}, length: ${length}, times: ${times}`);

    let counter = 0;

    for (let i = 0; i < times; ++i) {
        if (!test_once(size, length, query, myClass)) return false;
        counter += 1;
        if (counter === batch) {
            console.log(`test ${i + 1} passed!`);
            counter = 0;
        }
    }

    return true;
};

const main = async () => {
    const config = {
        query: "random",
        size: 10000,
        length: 1000,
        times: 10000,
        batch: 1000,
    };

    // const config = {
    //     query: "random",
    //     size: 100,
    //     length: 10,
    //     times: 10000,
    //     batch: 1000,
    // };

    console.log("test for 2D Range Tree:");
    run_test(config, my2DRangeTree);
    console.log("test for 2D Binary Search:");
    run_test(config, my2DBinarySearch);
};

main();
