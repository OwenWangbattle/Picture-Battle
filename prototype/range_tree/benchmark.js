const { my2DBinarySearch } = require("./bs2d");
const { my2DRangeTree } = require("./rt2d");
const { myBrute } = require("./brute");

const { generateRandomPoints, generateRandonRange } = require("./utils");

const queryBench = (config, myClass) => {
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

    console.log(
        `average: ${(totalDuration / rep).toFixed(2)}ms/${times} query`
    );
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

    console.log(
        `average: ${(totalDuration / rep).toFixed(2)}ms/${times} query`
    );
};

const benchQueryAll = (config) => {
    const configSparse = config.sparse;
    const configDense = config.dense;
    const configExtremeDense = config.edense;

    console.log("benchmark my2DRangeTree queryAll on sparse graph:");
    queryBench(configSparse, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryAll on dense graph:");
    queryBench(configDense, my2DRangeTree);
    console.log("benchmark my2DRangeTree queryAll on extreme dense graph:");
    queryBench(configExtremeDense, my2DRangeTree);

    console.log("\nbenchmark my2DBinarySearch queryAll on sparse graph:");
    queryBench(configSparse, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch queryAll on dense graph:");
    queryBench(configDense, my2DBinarySearch);
    console.log("benchmark my2DBinarySearch queryAll on extreme dense graph:");
    queryBench(configExtremeDense, my2DBinarySearch);

    console.log("\nbenchmark myBrute queryAll on sparse graph:");
    queryBench(configSparse, myBrute);
    console.log("benchmark myBrute queryAll on dense graph:");
    queryBench(configDense, myBrute);
    // console.log("benchmark myBrute queryAll on extreme dense graph:");
    // queryBench(configExtremeDense, myBrute);
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

    console.log("benchmark on queryExist method");
    benchQueryExist(config);
};

const main = async () => {
    bench();
};

main();
