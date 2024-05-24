(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    for (let i = st; i < this.L1.length && this.L1[i].x >= xLeft; --i) {
        const res = this.L1[i].queryOne(yTop, yBottom);
        if (res) return res;
    }

    return null;
};

module.exports = {
    my2DBinarySearch,
};

},{}],2:[function(require,module,exports){
const { my2DBinarySearch } = require("./range_tree/bs2d");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const fps = 50;

let intervalID = null;
let handleKeyDown = null;
let handleKeyUp = null;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.height = 21;
        this.width = 11;

        this.cancelFactor = 0;

        this.gravity = 0.4;
        this.moveSpeed = 3;
        this.maxFallingSpeed = 9;
        this.jumpSpeed = -8.5;
        this.dJumpSpeed = -7;

        this.jumpCounter = 0;

        this.vSpeed = 0;

        this.pendingAction = {
            left: false,
            right: false,
            jump: false,
            release: false,
        };
    }
    collision_Left_x(tree){
        let query = {
            topLeft: { x: this.x - 1, y: this.y - 1},
            bottomRight: { x: this.x - 1, y: this.y + this.height + 1},
        };
        if (tree.queryAll(query) !== null) return true;
        return false;
    }
    collision_Right_x(tree){
        let query = {
            topLeft: { x: this.x + this.width + 1, y: this.y - 1},
            bottomRight: { x: this.x + this.width + 1, y: this.y + this.height + 1},
        };
        if (tree.queryAll(query) !== null) return true;
        return false;
    }
    collision_Top_y(tree){
        let query = {
            topLeft: { x: this.x - 1, y: this.y - 1 },
            bottomRight: { x: this.x + this.width + 1, y: this.y - 1},
        };
        if (tree.queryExist(query) !== false) return true;
        return false;
    }
    collision_Bottom_y(tree){
        let query = {
            topLeft: { x: this.x - 1, y: this.y + this.height + 1 },
            bottomRight: { x: this.x + this.width + 1, y: this.y + this.height + 1 },
        };
        if (tree.queryExist(query) !== false) return true;
        return false;
    }
    next_step(pixels) {
        let nextX = this.x;
        let nextY = this.y;

        if (this.pendingAction.left) nextX -= this.moveSpeed;
        if (this.pendingAction.right) nextX += this.moveSpeed;

        if (this.pendingAction.jump) {
            if (this.jumpCounter === 0) {
                this.jumpCounter += 1;
                this.vSpeed = this.jumpSpeed;
            } else if (this.jumpCounter === 1) {
                this.jumpCounter += 1;
                this.vSpeed = this.dJumpSpeed;
            }
        }

        this.vSpeed = Math.min(
            this.maxFallingSpeed,
            this.vSpeed + this.gravity
        );

        if (this.pendingAction.release) {
            console.log("release!");
            if (this.vSpeed < 0) this.vSpeed *= this.cancelFactor;
        }
        // console.log(this.vSpeed);

        nextY += this.vSpeed;

        let flag = true;
        
        let points = [];
        for (const pixel of pixels) {
            points.push({x: pixel[1], y: pixel[0] });
        }
        // detect collision
        let tempbs2d = new my2DBinarySearch(points);
        let xCollision = this.collision_Left_x(tempbs2d) || this.collision_Right_x(tempbs2d);
        let yCollision = this.collision_Top_y(tempbs2d) || this.collision_Bottom_y(tempbs2d);
        console.log(xCollision, yCollision);
        let bothCollision = xCollision && yCollision;
        // for (const pixel of pixels) {
        //     const xCollision =
        //         nextX <= pixel[1] &&
        //         nextX + this.width >= pixel[1] &&
        //         this.y <= pixel[0] &&
        //         this.y + this.height >= pixel[0];
        //     const yCollision =
        //         this.x <= pixel[1] &&
        //         this.x + this.width >= pixel[1] &&
        //         nextY <= pixel[0] &&
        //         nextY + this.height >= pixel[0];
        //     const bothCollision =
        //         nextX <= pixel[1] &&
        //         nextX + this.width >= pixel[1] &&
        //         nextY <= pixel[0] &&
        //         nextY + this.height >= pixel[0];

            if (xCollision || yCollision || bothCollision) flag = false;

            if (xCollision) {
                // roll back to previous x, test only
                // should move contact to the pixel
                nextX = this.x;

            }

            if (yCollision || bothCollision) {
                // roll back to previous y, test only
                // should move contact to the pixel
                nextY = this.y;
                this.vSpeed = 0;
                this.jumpCounter = 0;
            }


        

        ctx.clearRect(this.x, Math.floor(this.y), this.width, this.height + 1);

        this.x = nextX;
        this.y = nextY;

        this.render(pixels);

        this.pendingAction.jump = false;
        this.pendingAction.release = false;
    }

    render(edges) {
        // for (const edge of edges) {
        //     ctx.fillRect(edge[1], edge[0], 1, 1);
        // }

        ctx.fillStyle = "red";

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "black";
    }
}

const start = async (edges) => {
    for (const edge of edges) {
        ctx.fillRect(edge[1], edge[0], 1, 1);
    }

    const player = new Player(20, 20);

    if (intervalID) clearInterval(intervalID);
    intervalID = setInterval(() => {
        player.next_step(edges);
    }, 1000 / fps);

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);

    handleKeyDown = (e) => {
        if (e.code === "ArrowLeft") {
            player.pendingAction.left = true;
        } else if (e.code === "ArrowRight") {
            player.pendingAction.right = true;
        } else if (e.shiftKey) {
            player.pendingAction.jump = true;
        }
    };

    handleKeyUp = (e) => {
        if (e.code === "ArrowLeft") {
            player.pendingAction.left = false;
        } else if (e.code === "ArrowRight") {
            player.pendingAction.right = false;
        } else if (e.key === "Shift") {
            player.pendingAction.release = true;
        }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
};

document.getElementById("uploader").addEventListener("click", async () => {
    let fileInput = document.getElementById("image");
    let file = fileInput.files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://127.0.0.1:3000/edge", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    canvas.width = data.width;
    canvas.height = data.height;
    start(data.edges);
});

},{"./range_tree/bs2d":1}]},{},[2]);
