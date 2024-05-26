function L2(x, points) {
    this.x = x;
    this.L2 = points;
}

L2.prototype.query = function (lower, upper) {
    const retval = [];

    let st = -1;

    let left = 0;
    let right = this.L2.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L2[mid].y >= lower) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return retval;

    for (let i = st; i < this.L2.length && this.L2[i].y <= upper; ++i)
        retval.push(this.L2[i]);

    return retval;
};

L2.prototype.queryExist = function (lower, upper) {
    let st = -1;

    let left = 0;
    let right = this.L2.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L2[mid].y >= lower) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return false;
    if (this.L2[st].y <= upper) return true;

    return false;
};

L2.prototype.queryMin = function (lower, upper) {
    let st = -1;

    let left = 0;
    let right = this.L2.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L2[mid].y >= lower) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return null;
    if (this.L2[st].y <= upper) return this.L2[st];

    return null;
};

L2.prototype.queryMax = function (lower, upper) {
    let st = -1;

    let left = 0;
    let right = this.L2.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L2[mid].y <= upper) {
            st = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (st === -1) return null;
    if (this.L2[st].y >= lower) return this.L2[st];

    return null;
};

L2.prototype.queryOne = function (lower, upper) {
    let st = -1;

    let left = 0;
    let right = this.L2.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L2[mid].y >= lower) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return null;
    if (this.L2[st].y <= upper) return this.L2[st];

    return null;
};

function my2DBinarySearch(points) {
    this.L1 = [];

    const sorted = points.sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

    let curX = null;
    let curList = [];
    for (const point of sorted) {
        if (curX !== point.x) {
            if (curX) this.L1.push(new L2(curX, curList));
            curX = point.x;
            curList = [];
        }
        curList.push(point);
    }
    if (curX) this.L1.push(new L2(curX, curList));
}

my2DBinarySearch.prototype.queryAll = function (query) {
    const retval = [];

    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x >= xLeft) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return retval;

    for (let i = st; i < this.L1.length && this.L1[i].x <= xRight; ++i)
        retval.push(...this.L1[i].query(yTop, yBottom));

    return retval;
};

my2DBinarySearch.prototype.queryExist = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x >= xLeft) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return false;

    for (let i = st; i < this.L1.length && this.L1[i].x <= xRight; ++i)
        if (this.L1[i].queryExist(yTop, yBottom)) return true;

    return false;
};

my2DBinarySearch.prototype.queryBottomY = function (query) {
    let retval = null;

    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x >= xLeft) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return null;

    for (let i = st; i < this.L1.length && this.L1[i].x <= xRight; ++i) {
        const p = this.L1[i].queryMin(yTop, yBottom);
        if (!p) continue;
        if (retval === null) retval = p;
        else if (retval.y > p.y) retval = p;
    }

    return retval;
};

my2DBinarySearch.prototype.queryTopY = function (query) {
    let retval = null;

    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x >= xLeft) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return null;

    for (let i = st; i < this.L1.length && this.L1[i].x <= xRight; ++i) {
        const p = this.L1[i].queryMax(yTop, yBottom);
        if (!p) continue;
        if (retval === null) retval = p;
        else if (retval.y < p.y) retval = p;
    }

    return retval;
};

my2DBinarySearch.prototype.queryLeftX = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x >= xLeft) {
            st = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    if (st === -1) return null;
    for (let i = st; i < this.L1.length && this.L1[i].x <= xRight; ++i) {
        const res = this.L1[i].queryOne(yTop, yBottom);
        if (res) return res;
    }

    return null;
};

my2DBinarySearch.prototype.queryRightX = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let st = -1;

    let left = 0;
    let right = this.L1.length - 1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (this.L1[mid].x <= xRight) {
            st = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (st === -1) return null;
    for (let i = st; i >= 0 && this.L1[i].x >= xLeft; --i) {
        const res = this.L1[i].queryOne(yTop, yBottom);
        if (res) return res;
    }

    return null;
};
export default my2DBinarySearch;
