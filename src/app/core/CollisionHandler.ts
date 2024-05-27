import CollidableObject from "./CollidableObject";
import my2DBinarySearch from "./bs2d";

class CollisionHandler {
    backgroundCollision: my2DBinarySearch;

    collisionObjects: {
        type: string;
        object: CollidableObject;
    }[];

    constructor(backgroundCollision: my2DBinarySearch) {
        this.backgroundCollision = backgroundCollision;
        this.collisionObjects = [];
    }

    addCollisionObject(type: string, object: CollidableObject) {
        this.collisionObjects.push({
            type,
            object,
        });

        return this.collisionObjects.length - 1;
    }

    removeCollisionObject(index: number) {
        this.collisionObjects = this.collisionObjects.reduce(
            (acc, val, i) => {
                if (i !== index) {
                    acc.push(val);
                }
                return acc;
            },
            [] as {
                type: string;
                object: any;
            }[]
        );
    }

    queryCollisionItems(targetIndex: number, types: string[] | null) {
        const result = [];

        const target = this.collisionObjects[targetIndex].object;

        for (let i = 0; i < this.collisionObjects.length; ++i) {
            if (i === targetIndex) continue;
            if (!types || types.includes(this.collisionObjects[i].type)) {
                if (target.collide(this.collisionObjects[i].object))
                    result.push(this.collisionObjects[i]);
            }
        }
        return result;
    }
}

export default CollisionHandler;
