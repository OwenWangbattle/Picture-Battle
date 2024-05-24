const { my2DBinarySearch } = require("./bs2d");
const { my2DRangeTree } = require("./rt2d");
const { myBrute } = require("./brute");

const { generateRandomPoints, generateRandonRange } = require("./utils");

const queryAllBench = (config, myClass) => {
    const rep = config.rep || 1;
    const times = config.times || 100;

    const size = config.size || 20;
    const length = config.length || 10;

    let totalDuration = 0;

    for (let i = 0; i < rep; ++i) {
        const q = new myClass(generateRandomPoints(size, length, false));
        process.stdout.write(`\r\x1b[K${i + 1}/${rep}`);

        const start = performance.now();
        for (let i = 0; i < times; ++i) {
            q.queryAll(generateRandonRange(size));
        }
        const end = performance.now();

        const duration = end - start;
        totalDuration += duration;
    }
    process.stdout.write(`\r\x1b[K`);

    const speed = (totalDuration / rep).toFixed(2);

    console.log(`average: ${speed}ms/${times} query`);

    return speed;
};

const queryExistBench = (config, myClass) => {
    const rep = config.rep || 1;
    const times = config.times || 100;

    const size = config.size || 20;
    const length = config.length || 10;

    let totalDuration = 0;

    for (let i = 0; i < rep; ++i) {
        const q = new myClass(generateRandomPoints(size, length, false));
        process.stdout.write(`\r\x1b[K${i + 1}/${rep}`);

        const start = performance.now();
        for (let i = 0; i < times; ++i) {
            q.queryExist(generateRandonRange(size));
        }
        const end = performance.now();

        const duration = end - start;
        totalDuration += duration;
    }
    process.stdout.write(`\r\x1b[K`);

    const speed = (totalDuration / rep).toFixed(2);

    console.log(`average: ${speed}ms/${times} query`);

    return speed;
};

const queryLeftXBench = (config, myClass) => {
    const rep = config.rep || 1;
    const times = config.times || 100;

    const size = config.size || 20;
    const length = config.length || 10;

    let totalDuration = 0;

    for (let i = 0; i < rep; ++i) {
        const q = new myClass(generateRandomPoints(size, length, false));
        process.stdout.write(`\r\x1b[K${i + 1}/${rep}`);

        const start = performance.now();
        for (let i = 0; i < times; ++i) {
            q.queryLeftX(generateRandonRange(size));
        }
        const end = performance.now();

        const duration = end - start;
        totalDuration += duration;
    }
    process.stdout.write(`\r\x1b[K`);

    const speed = (totalDuration / rep).toFixed(2);

    console.log(`average: ${speed}ms/${times} query`);

    return speed;
};

const queryBottomYBench = (config, myClass) => {
    const rep = config.rep || 1;
    const times = config.times || 100;

    const size = config.size || 20;
    const length = config.length || 10;

    let totalDuration = 0;

    for (let i = 0; i < rep; ++i) {
        const q = new myClass(generateRandomPoints(size, length, false));
        process.stdout.write(`\r\x1b[K${i + 1}/${rep}`);

        const start = performance.now();
        for (let i = 0; i < times; ++i) {
            q.queryBottomY(generateRandonRange(size));
        }
        const end = performance.now();

        const duration = end - start;
        totalDuration += duration;
    }
    process.stdout.write(`\r\x1b[K`);

    const speed = (totalDuration / rep).toFixed(2);

    console.log(`average: ${speed}ms/${times} query`);

    return speed;
};

const benchQueryAll = (config) => {
    const configSparse = config.sparse;
    const configDense = config.dense;
    const configExtremeDense = config.edense;

    console.log("benchmark my2DRangeTree queryAll on sparse graph:");
    queryAllBench(configSparse, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryAll on dense graph:");
    queryAllBench(configDense, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryAll on extreme dense graph:");
    queryAllBench(configExtremeDense, my2DRangeTree);

    console.log("\nbenchmark my2DBinarySearch queryAll on sparse graph:");
    queryAllBench(configSparse, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch queryAll on dense graph:");
    queryAllBench(configDense, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch queryAll on extreme dense graph:");
    queryAllBench(configExtremeDense, my2DBinarySearch);

    console.log("\nbenchmark myBrute queryAll on sparse graph:");
    queryAllBench(configSparse, myBrute);
    console.log("benchmark myBrute queryAll on dense graph:");
    queryAllBench(configDense, myBrute);
    // console.log("benchmark myBrute queryAll on extreme dense graph:");
    // queryAllBench(configExtremeDense, myBrute);
};

const benchQueryExist = (config) => {
    const configSparse = config.sparse;
    const configDense = config.dense;
    const configExtremeDense = config.edense;

    console.log("benchmark my2DRangeTree queryExist on sparse graph:");
    queryExistBench(configSparse, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryExist on dense graph:");
    queryExistBench(configDense, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryExist on extreme dense graph:");
    queryExistBench(configExtremeDense, my2DRangeTree);

    console.log("\nbenchmark my2DBinarySearch queryExist on sparse graph:");
    queryExistBench(configSparse, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch queryExist on dense graph:");
    queryExistBench(configDense, my2DBinarySearch);
    console.log(
        "benchmark my2DBinarySearch queryExist on extreme dense graph:"
    );
    queryExistBench(configExtremeDense, my2DBinarySearch);

    console.log("\nbenchmark myBrute queryExist on sparse graph:");
    queryExistBench(configSparse, myBrute);
    console.log("benchmark myBrute queryExist on dense graph:");
    queryExistBench(configDense, myBrute);
    // console.log("benchmark myBrute queryExist on extreme dense graph:");
    // queryExistBench(configExtremeDense, myBrute);
};

const benchQueryLeftX = (config) => {
    const configSparse = config.sparse;
    const configDense = config.dense;
    const configExtremeDense = config.edense;

    console.log("benchmark my2DRangeTree QueryLeftX on sparse graph:");
    queryLeftXBench(configSparse, my2DRangeTree);
    console.log("benchmark my2DRangeTree QueryLeftX on dense graph:");
    queryLeftXBench(configDense, my2DRangeTree);
    console.log("benchmark my2DRangeTree QueryLeftX on extreme dense graph:");
    queryLeftXBench(configExtremeDense, my2DRangeTree);

    console.log("\nbenchmark my2DBinarySearch QueryLeftX on sparse graph:");
    queryLeftXBench(configSparse, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch QueryLeftX on dense graph:");
    queryLeftXBench(configDense, my2DBinarySearch);
    console.log(
        "benchmark my2DBinarySearch QueryLeftX on extreme dense graph:"
    );
    queryLeftXBench(configExtremeDense, my2DBinarySearch);

    console.log("\nbenchmark myBrute QueryLeftX on sparse graph:");
    queryLeftXBench(configSparse, myBrute);
    console.log("benchmark myBrute QueryLeftX on dense graph:");
    queryLeftXBench(configDense, myBrute);
    // console.log("benchmark myBrute QueryLeftX on extreme dense graph:");
    // queryLeftXBench(configExtremeDense, myBrute);
};

const benchQueryBottomY = (config) => {
    const configSparse = config.sparse;
    const configDense = config.dense;
    const configExtremeDense = config.edense;

    console.log("benchmark my2DRangeTree QueryBottomY on sparse graph:");
    queryBottomYBench(configSparse, my2DRangeTree);
    console.log("benchmark my2DRangeTree QueryBottomY on dense graph:");
    queryBottomYBench(configDense, my2DRangeTree);
    console.log("benchmark my2DRangeTree QueryBottomY on extreme dense graph:");
    queryBottomYBench(configExtremeDense, my2DRangeTree);

    console.log("\nbenchmark my2DBinarySearch QueryBottomY on sparse graph:");
    queryBottomYBench(configSparse, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch QueryBottomY on dense graph:");
    queryBottomYBench(configDense, my2DBinarySearch);
    console.log(
        "benchmark my2DBinarySearch QueryBottomY on extreme dense graph:"
    );
    queryBottomYBench(configExtremeDense, my2DBinarySearch);

    console.log("\nbenchmark myBrute QueryBottomY on sparse graph:");
    queryBottomYBench(configSparse, myBrute);
    console.log("benchmark myBrute QueryBottomY on dense graph:");
    queryBottomYBench(configDense, myBrute);
    // console.log("benchmark myBrute QueryBottomY on extreme dense graph:");
    // queryBottomYBench(configExtremeDense, myBrute);
};

const bench = () => {
    const configSparse = {
        rep: 10,
        times: 10000,
        size: 1000,
        length: 1000,
    };

    const configDense = {
        rep: 10,
        times: 10000,
        size: 1000,
        length: 20000,
    };

    const configExtremeDense = {
        rep: 10,
        times: 10000,
        size: 1000,
        length: 100000,
    };

    const config = {
        sparse: configSparse,
        dense: configDense,
        edense: configExtremeDense,
    };

    // console.log("benchmark on queryAll method");
    // benchQueryAll(config);

    // console.log("benchmark on queryExist method");
    // benchQueryExist(config);

    console.log("benchmark on queryBottomY method");
    benchQueryBottomY(config);

    console.log("\nbenchmark on queryLeftX method");
    benchQueryLeftX(config);
};

const benchIncreaseDense = () => {
    const st = 1000;
    const ed = 10000;
    const trial = 10;
    const gap = Math.round((ed - st) / (trial - 1));

    const config = {
        rep: 5,
        times: 10000,
        size: 1000,
        length: st,
    };

    let data = {
        bin: [],
        bst: [],
        brute: [],
    };

    for (let i = 0; i < 10; ++i) {
        console.log(`benchmark my2DBinarySearch queryAll #${i + 1}`);
        data.bin.push(queryAllBench(config, my2DBinarySearch));
        console.log(`benchmark my2DRangeTree queryAll #${i + 1}`);
        data.bst.push(queryAllBench(config, my2DRangeTree));
        console.log(`benchmark myBrute queryAll #${i + 1}`);
        data.brute.push(queryAllBench(config, myBrute));
        config.length += gap;
    }

    console.log("benchmark queryAll data");
    console.log(data);

    config.length = st;
    data = {
        bin: [],
        bst: [],
        brute: [],
    };
    for (let i = 0; i < 10; ++i) {
        console.log(`benchmark my2DBinarySearch queryExist #${i + 1}`);
        data.bin.push(queryExistBench(config, my2DBinarySearch));
        console.log(`benchmark my2DRangeTree queryExist #${i + 1}`);
        data.bst.push(queryExistBench(config, my2DRangeTree));
        console.log(`benchmark myBrute queryExist #${i + 1}`);
        data.brute.push(queryExistBench(config, myBrute));
        config.length += gap;
    }

    console.log("benchmark queryExist data");
    console.log(data);

    config.length = st;
    data = {
        bin: [],
        bst: [],
        brute: [],
    };
    for (let i = 0; i < 10; ++i) {
        console.log(`benchmark my2DBinarySearch queryBottomY #${i + 1}`);
        data.bin.push(queryBottomYBench(config, my2DBinarySearch));
        console.log(`benchmark my2DRangeTree queryBottomY #${i + 1}`);
        data.bst.push(queryBottomYBench(config, my2DRangeTree));
        console.log(`benchmark myBrute queryBottomY #${i + 1}`);
        data.brute.push(queryBottomYBench(config, myBrute));
        config.length += gap;
    }

    console.log("benchmark queryBottomY data");
    console.log(data);

    config.length = st;
    data = {
        bin: [],
        bst: [],
        brute: [],
    };
    for (let i = 0; i < 10; ++i) {
        console.log(`benchmark my2DBinarySearch queryLeftX #${i + 1}`);
        data.bin.push(queryLeftXBench(config, my2DBinarySearch));
        console.log(`benchmark my2DRangeTree queryLeftX #${i + 1}`);
        data.bst.push(queryLeftXBench(config, my2DRangeTree));
        console.log(`benchmark myBrute queryLeftX #${i + 1}`);
        data.brute.push(queryLeftXBench(config, myBrute));
        config.length += gap;
    }

    console.log("benchmark queryLeftX data");
    console.log(data);
};

const main = async () => {
    // bench();
    benchIncreaseDense();
};

main();
