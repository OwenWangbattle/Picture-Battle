const createTree = require("functional-red-black-tree");

const printTree = (node) => {
    if (!node) return;
    console.log(node.value);
    printTree(node.left);
    printTree(node.right);
};

const checkRange = (left, right, val) => {
    return val >= left && val <= right;
};

const queryYRange = (tree, lower, upper, result) => {
    // built-in ge function + iterator does not seem to work
    // have to write my own range query
    const rangeQuery = (node) => {
        if (node === null) return;

        if (lower <= node.key) {
            rangeQuery(node.left);
        }

        if (lower <= node.key && node.key <= upper) {
            result.push(node.value);
        }

        if (upper >= node.key) {
            rangeQuery(node.right);
        }
    };

    return rangeQuery(tree.root);
};

const queryYRangeExist = (tree, lower, upper) => {
    const rangeQuery = (node) => {
        if (node === null) return;

        if (lower <= node.key && rangeQuery(node.left)) return true;

        if (lower <= node.key && node.key <= upper) return true;

        if (upper >= node.key && rangeQuery(node.right)) return true;

        return false;
    };

    return rangeQuery(tree.root);
};

const queryYRangeMin = (tree, lower, upper) => {
    const retval = tree.ge(lower)?.value;
    if (!retval || retval.y > upper) return null;
    return retval;
};

const queryYRangeMax = (tree, lower, upper) => {
    const retval = tree.le(upper)?.value;
    if (!retval || retval.y < lower) return null;
    return retval;
};

function myNode(curPoint, points) {
    this.point = curPoint;
    if (!points) this.yTree = null;
    else {
        this.yTree = createTree();

        for (const point of points) {
            this.yTree = this.yTree.insert(point.y, point);
        }
    }
}

myNode.prototype.updateYList = function (points) {
    this.yTree = createTree();

    for (const point of points) {
        this.yTree = this.yTree.insert(point.y, point);
    }
};

function my2DRangeTree(points) {
    this.tree = createTree();

    // insert first level tree (x coordinates)
    for (const point of points) {
        this.tree = this.tree.insert(point.x, new myNode(point));
    }

    // build second level tree (y coordinates)
    const buildYTree = (node) => {
        if (!node) return [];
        const left = buildYTree(node.left);
        const right = buildYTree(node.right);
        const pointList = [...left, ...right, node.value.point];
        node.value.updateYList(pointList);
        return pointList;
    };

    buildYTree(this.tree.root);
}

my2DRangeTree.prototype.print = function () {
    const printY = (node) => {
        if (!node) return;
        console.log(`       ${node.value.x}, ${node.value.y}`);
        printY(node.left);
        printY(node.right);
    };

    const print = (node, parent) => {
        console.log(
            `   ${node.value.point.x},${node.value.point.y} ${parent.value.point.x},${parent.value.point.y}`
        );
        // console.log("   yPoints");
        // printY(node.value.yTree.root);

        if (node.left) {
            // console.log("left: ");
            print(node.left, node);
        }

        if (node.right) {
            // console.log("right: ");
            print(node.right, node);
        }
    };

    console.log("root: ");
    print(this.tree.root, this.tree.root);
};

my2DRangeTree.prototype.queryAll = function (range) {
    const retval = [];

    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    const rangeQuery = (node, lower, upper) => {
        if (node === null) return;

        if (xLeft <= lower && upper <= xRight) {
            queryYRange(node.value.yTree, yTop, yBottom, retval);
            return;
        }

        if (xLeft <= node.key) rangeQuery(node.left, lower, node.key);

        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y))
                retval.push(node.value.point);
        }

        if (xRight >= node.key) rangeQuery(node.right, node.key, upper);
    };

    rangeQuery(
        this.tree.root,
        this.tree.begin.value.point.x,
        this.tree.end.value.point.x
    );

    return retval;
};

my2DRangeTree.prototype.queryExist = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    const rangeQuery = (node, lower, upper) => {
        if (node === null) return false;

        if (xLeft <= lower && upper <= xRight) {
            if (queryYRangeExist(node.value.yTree, yTop, yBottom)) return true;
            return false;
        }

        if (xLeft <= node.key && rangeQuery(node.left, lower, node.key))
            return true;

        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y)) return true;
        }

        if (xRight >= node.key && rangeQuery(node.right, node.key, upper))
            return true;

        return false;
    };

    return rangeQuery(
        this.tree.root,
        this.tree.begin.value.point.x,
        this.tree.end.value.point.x
    );
};

my2DRangeTree.prototype.queryBottomY = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    let retval = null;

    const rangeQuery = (node, lower, upper) => {
        if (node === null) return;

        if (xLeft <= lower && upper <= xRight) {
            const res = queryYRangeMin(node.value.yTree, yTop, yBottom);
            if (res) {
                if (retval === null) retval = res;
                else if (retval.y > res.y) retval = res;
            }
            return;
        }

        if (xLeft <= node.key) {
            rangeQuery(node.left, lower, node.key);
        }

        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y)) {
                if (retval === null) retval = node.value.point;
                else if (retval.y > node.value.point.y)
                    retval = node.value.point;
            }
        }

        if (xRight >= node.key) {
            rangeQuery(node.right, node.key, upper);
        }
    };

    rangeQuery(
        this.tree.root,
        this.tree.begin.value.point.x,
        this.tree.end.value.point.x
    );

    return retval;
};

my2DRangeTree.prototype.queryTopY = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    let retval = null;

    const rangeQuery = (node, lower, upper) => {
        if (node === null) return;

        if (xLeft <= lower && upper <= xRight) {
            const res = queryYRangeMax(node.value.yTree, yTop, yBottom);
            if (res) {
                if (retval === null) retval = res;
                else if (retval.y < res.y) retval = res;
            }
            return;
        }

        if (xLeft <= node.key) {
            rangeQuery(node.left, lower, node.key);
        }

        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y)) {
                if (retval === null) retval = node.value.point;
                else if (retval.y < node.value.point.y)
                    retval = node.value.point;
            }
        }

        if (xRight >= node.key) {
            rangeQuery(node.right, node.key, upper);
        }
    };

    rangeQuery(
        this.tree.root,
        this.tree.begin.value.point.x,
        this.tree.end.value.point.x
    );

    return retval;
};

my2DRangeTree.prototype.queryLeftX = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    const rangeQuery = (node) => {
        if (node === null) return null;

        if (xLeft <= node.key) {
            const res = rangeQuery(node.left);
            if (res) return res;
        }
        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y)) {
                return node.value.point;
            }
        }

        if (xRight >= node.key) {
            const res = rangeQuery(node.right);
            if (res) return res;
        }

        return null;
    };

    return rangeQuery(this.tree.root);
};

my2DRangeTree.prototype.queryRightX = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    const rangeQuery = (node) => {
        if (node === null) return null;

        if (xRight >= node.key) {
            const res = rangeQuery(node.right);
            if (res) return res;
        }

        if (xLeft <= node.key && node.key <= xRight) {
            if (checkRange(yTop, yBottom, node.value.point.y)) {
                return node.value.point;
            }
        }

        if (xLeft <= node.key) {
            const res = rangeQuery(node.left);
            if (res) return res;
        }

        return null;
    };

    return rangeQuery(this.tree.root);
};

module.exports = {
    my2DRangeTree,
};
