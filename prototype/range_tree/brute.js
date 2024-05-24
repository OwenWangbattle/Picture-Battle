function myBrute(points) {
    this.points = points;
}

myBrute.prototype.queryAll = function (query) {
    const retval = [];

    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        )
            retval.push(point);
    }
    return retval;
};

myBrute.prototype.queryExist = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        )
            return true;
    }
    return false;
};

myBrute.prototype.queryBottomY = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let retval = null;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        ) {
            if (retval === null) retval = point;
            else if (point.y < retval.y) retval = point;
        }
    }
    return retval;
};

myBrute.prototype.queryTopY = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let retval = null;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        ) {
            if (retval === null) retval = point;
            else if (point.y > retval.y) retval = point;
        }
    }
    return retval;
};

myBrute.prototype.queryLeftX = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let retval = null;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        ) {
            if (retval === null) retval = point;
            else if (point.x < retval.x) retval = point;
        }
    }
    return retval;
};

myBrute.prototype.queryRightX = function (query) {
    const xLeft = query.topLeft.x;
    const xRight = query.bottomRight.x;
    const yTop = query.topLeft.y;
    const yBottom = query.bottomRight.y;

    let retval = null;

    for (const point of this.points) {
        if (
            point.x >= xLeft &&
            point.x <= xRight &&
            point.y >= yTop &&
            point.y <= yBottom
        ) {
            if (retval === null) retval = point;
            else if (point.x > retval.x) retval = point;
        }
    }
    return retval;
};

module.exports = {
    myBrute,
};
