class keyMapper {
    jumpKey: string;
    moveLeftKey: string;
    moveRightKey: string;
    attackKey: string;

    constructor() {
        var ls = window.localStorage;
        this.jumpKey = ls.getItem("jumpKey") || "Space";
        this.moveLeftKey = ls.getItem("moveLeftKey") || "ArrowLeft";
        this.moveRightKey = ls.getItem("moveRightKey") || "ArrowRight";
        this.attackKey = ls.getItem("attackKey") || "KeyF";
    }

    remap(keyMap: {
        jumpKey?: string;
        moveLeftKey?: string;
        moveRightKey?: string;
        attackKey?: string;
    }) {
        if (keyMap.jumpKey) {this.jumpKey = keyMap.jumpKey; window.localStorage.setItem("jumpKey", keyMap.jumpKey); }
        if (keyMap.moveLeftKey) {this.moveLeftKey = keyMap.moveLeftKey; window.localStorage.setItem("moveLeftKey", keyMap.moveLeftKey); }
        if (keyMap.moveRightKey) {this.moveRightKey = keyMap.moveRightKey; window.localStorage.setItem("moveRightKey", keyMap.moveRightKey);}
        if (keyMap.attackKey) {this.attackKey = keyMap.attackKey; window.localStorage.setItem("attackKey", keyMap.attackKey);}
    }
}

export default keyMapper;
