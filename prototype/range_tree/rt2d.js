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
    // built-in ge function + iterator does not seem to work
    // have to write my own range query
    const rangeQuery = (node) => {
        if (node === null) return;

        let retval = false;

        if (lower <= node.key) {
            retval |= rangeQuery(node.left);
        }

        if (lower <= node.key && node.key <= upper) {
            return true;
        }

        if (upper >= node.key) {
            retval |= rangeQuery(node.right);
        }

        return retval;
    };

    return rangeQuery(tree.root);
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

    let root = this.tree.root;
    // find split point
    const find_split = (node, lower, upper) => {
        if (node === null) return null;

        if (lower <= node.key && node.key <= upper) {
            return node;
        }

        if (lower < node.key) {
            const q = find_split(node.left, lower, upper);
            if (q) return q;
        }

        if (upper > node.key) {
            const q = find_split(node.right, lower, upper);
            if (q) return q;
        }

        return null;
    };

    root = find_split(root, xLeft, xRight);
    if (!root) return retval;

    if (checkRange(yTop, yBottom, root.value.point.y))
        retval.push(root.value.point);

    const queryLeft = (cur) => {
        while (cur && cur.key >= xLeft) {
            const right = cur.right;
            if (right) queryYRange(right.value.yTree, yTop, yBottom, retval);
            if (checkRange(yTop, yBottom, cur.value.point.y))
                retval.push(cur.value.point);
            cur = cur.left;
        }
        if (!cur) return;

        cur = cur.right;
        while (cur && cur.key < xLeft) cur = cur.right;
        if (!cur) return;

        if (checkRange(yTop, yBottom, cur.value.point.y))
            retval.push(cur.value.point);

        if (cur.right)
            queryYRange(cur.right.value.yTree, yTop, yBottom, retval);
        if (cur.left) queryLeft(cur.left);
    };

    const queryRight = (cur) => {
        while (cur && cur.key <= xRight) {
            const left = cur.left;
            if (left) queryYRange(left.value.yTree, yTop, yBottom, retval);
            if (checkRange(yTop, yBottom, cur.value.point.y))
                retval.push(cur.value.point);
            cur = cur.right;
        }
        if (!cur) return;

        cur = cur.left;
        while (cur && cur.key > xRight) cur = cur.left;
        if (!cur) return;

        if (checkRange(yTop, yBottom, cur.value.point.y))
            retval.push(cur.value.point);

        if (cur.left) queryYRange(cur.left.value.yTree, yTop, yBottom, retval);
        if (cur.right) queryRight(cur.right);
    };

    if (root.left) queryLeft(root.left);
    if (root.right) queryRight(root.right);

    return retval;
};

my2DRangeTree.prototype.queryExist = function (range) {
    const xLeft = range.topLeft.x;
    const xRight = range.bottomRight.x;
    const yTop = range.topLeft.y;
    const yBottom = range.bottomRight.y;

    let root = this.tree.root;
    // find split point
    const find_split = (node, lower, upper) => {
        if (node === null) return null;

        if (lower <= node.key && node.key <= upper) {
            return node;
        }

        if (lower < node.key) {
            const q = find_split(node.left, lower, upper);
            if (q) return q;
        }

        if (upper > node.key) {
            const q = find_split(node.right, lower, upper);
            if (q) return q;
        }

        return null;
    };

    root = find_split(root, xLeft, xRight);
    if (!root) return false;

    if (checkRange(yTop, yBottom, root.value.point.y)) return true;

    const queryLeft = (cur) => {
        while (cur && cur.key >= xLeft) {
            if (checkRange(yTop, yBottom, cur.value.point.y)) return true;
            const right = cur.right;
            if (right && queryYRangeExist(right.value.yTree, yTop, yBottom))
                return true;
            cur = cur.left;
        }
        if (!cur) return false;

        cur = cur.right;
        while (cur && cur.key < xLeft) cur = cur.right;
        if (!cur) return false;

        if (checkRange(yTop, yBottom, cur.value.point.y)) return true;

        if (cur.right && queryYRangeExist(cur.right.value.yTree, yTop, yBottom))
            return true;
        if (cur.left) return queryLeft(cur.left);
        return false;
    };

    const queryRight = (cur) => {
        while (cur && cur.key <= xRight) {
            if (checkRange(yTop, yBottom, cur.value.point.y)) return true;
            const left = cur.left;
            if (left && queryYRangeExist(left.value.yTree, yTop, yBottom))
                return true;
            cur = cur.right;
        }
        if (!cur) return false;

        cur = cur.left;
        while (cur && cur.key > xRight) cur = cur.left;
        if (!cur) return false;

        if (checkRange(yTop, yBottom, cur.value.point.y)) return true;

        if (cur.left && queryYRangeExist(cur.left.value.yTree, yTop, yBottom))
            return true;
        if (cur.right) return queryRight(cur.right);
        return false;
    };

    if (root.left && queryLeft(root.left)) return true;
    if (root.right && queryRight(root.right)) return true;

    return false;
};

module.exports = {
    my2DRangeTree,
};
