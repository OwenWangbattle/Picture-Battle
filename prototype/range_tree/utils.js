const generateRandomPoints = (size, length, allowDup) => {
    const points = [];
    const maxX = size;
    const minX = 0;
    const maxY = size;
    const minY = 0;
    for (let i = 0; i < length; ++i) {
        const randomX = Math.round(Math.random() * (maxX - minX) + minX);
        const randomY = Math.round(Math.random() * (maxY - minY) + minY);
        points.push({ x: randomX, y: randomY });
    }

    if (!allowDup) {
        return points.filter(
            (point, index, self) =>
                index ===
                self.findIndex((p) => p.x === point.x && p.y === point.y)
        );
    }

    return points;
};

const generateRandonRange = (size) => {
    const p1x = Math.round(Math.random() * size);
    const p1y = Math.round(Math.random() * size);

    const p2x = Math.round(Math.random() * size);
    const p2y = Math.round(Math.random() * size);

    return {
        topLeft: {
            x: Math.min(p1x, p2x),
            y: Math.min(p1y, p2y),
        },
        bottomRight: {
            x: Math.max(p1x, p2x),
            y: Math.max(p1y, p2y),
        },
    };
};

module.exports = {
    generateRandomPoints,
    generateRandonRange,
};
