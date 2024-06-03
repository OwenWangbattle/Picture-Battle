class frameAdvancer {
    objects: any[];

    constructor(objects?: any[] | null) {
        if (objects) this.objects = objects;
        else this.objects = [];
    }

    addItem(object: any) {
        if (object.next_frame === undefined) {
            throw "frameAdvancer: object has not next frame function!";
        }
        this.objects.push(object);
    }

    checkItems() {
        const new_lists = [];
        for (const object of this.objects) {
            if (object.destoryed !== undefined && object.destoryed) continue;
            new_lists.push(object);
        }

        this.objects = new_lists;
    }

    advance() {
        this.checkItems();

        for (const object of this.objects) {
            object.next_frame();
        }
    }
}

export default frameAdvancer;
