function Vec(x, y) {
    this.x = x;
    this.y = y;
}

const dot = function (vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
};

const normalize = function (vec) {
    let len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    let vec1 = new Vec(vec.x / len, vec.y / len);
    return vec1;
};

const perp = function (vec) {
    let vec1 = new Vec(-vec.y, vec.x);
    return vec1;
};

function line(vec1, vec2, dir) {
    this.vec1 = vec1;
    this.vec2 = vec2;
    this.dir = dir || new Vec(vec2.x - vec1.x, vec2.y - vec1.y);
}

function polygon(obj) {
    this.vec = [];
    this.edges = [];
    this.vec.push(new Vec(obj.x, obj.y));
    this.vec.push(
        new Vec(
            obj.x + obj.width * Math.cos(obj.angle),
            obj.y + obj.width * Math.sin(obj.angle)
        )
    );
    this.vec.push(
        new Vec(
            obj.x +
                obj.width * Math.cos(obj.angle) +
                obj.height * Math.cos(obj.angle + Math.PI / 2),
            obj.y +
                obj.width * Math.sin(obj.angle) +
                obj.height * Math.sin(obj.angle + Math.PI / 2)
        )
    );
    this.vec.push(
        new Vec(
            obj.x + obj.height * Math.cos(obj.angle + Math.PI / 2),
            obj.y + obj.height * Math.sin(obj.angle + Math.PI / 2)
        )
    );
    for (let i = 0; i < this.vec.length; i++) {
        let dir = new Vec(
            this.vec[(i + 1) % this.vec.length].x - this.vec[i].x,
            this.vec[(i + 1) % this.vec.length].y - this.vec[i].y
        );
        this.edges.push(
            new line(this.vec[i], this.vec[(i + 1) % this.vec.length], dir)
        );
    }
}

const project = function (poly, axis) {
    axis = normalize(axis);
    let min = dot(poly.vec[0], axis);
    let max = min;
    for (let i = 0; i < poly.vec.length; i++) {
        let proj = dot(poly.vec[i], axis);
        if (proj < min) {
            min = proj;
        }
        if (proj > max) {
            max = proj;
        }
    }
    const result = [min, max];
    return result;
};

const contains = function (n, range) {
    let a = range[0];
    let b = range[1];
    if (b < a) {
        a = b;
        b = range[0];
    }
    return n >= a && n <= b;
};

const overlap = function (a, b) {
    if (
        contains(a[0], b) ||
        contains(a[1], b) ||
        contains(b[0], a) ||
        contains(b[1], a)
    ) {
        return true;
    }
    return false;
};

function SAT() {}

SAT.prototype.collide = function (obj1, obj2) {
    let poly1 = new polygon(obj1);
    let poly2 = new polygon(obj2);
    for (let i = 0; i < poly1.vec.length; i++) {
        let axis = perp(poly1.edges[i].dir);
        let a = project(poly1, axis);
        let b = project(poly2, axis);
        if (overlap(a, b) === false) {
            return false;
        }
    }
    for (let i = 0; i < poly2.vec.length; i++) {
        let axis = perp(poly2.edges[i].dir);
        let a = project(poly1, axis);
        let b = project(poly2, axis);
        if (overlap(a, b) === false) {
            return false;
        }
    }
    return true;
};

// module.exports = { SAT };
export default SAT;
