const sorted = require("sorted-array-functions");

class Renderer {
    list: [];

    constructor(list?: []) {
        if (list) this.list = list;
        else this.list = [];
    }

    static compare(a: any, b: any) {
        return a.zIndex > b.zIndex ? 1 : a.zIndex === b.zIndex ? 0 : -1;
    }

    addItem(item: any) {
        if (item.zIndex === undefined) item.zIndex = 0;
        if (item.destoryed === undefined) item.destoryed = false;
        if (typeof item.render !== "function") {
            console.error("item does not have rendering function");
            console.error(item);
            return;
        }
        sorted.add(this.list, item, Renderer.compare);
    }

    removeItem(index: number) {
        this.list = this.list.reduce((acc, val, i) => {
            if (i !== index) {
                acc.push(val);
            }
            return acc;
        }, []);
    }

    render(ctx: CanvasRenderingContext2D) {
        console.log("start render");
        for (let i = 0; i < this.list.length; ++i) {
            const item = this.list[i] as any;
            if (item.destoryed) {
                this.removeItem(i);
                continue;
            }
            console.log(`render ${item.zIndex}`);
            item.render(ctx);
        }
        console.log("end reneder");
    }
}

export default Renderer;
