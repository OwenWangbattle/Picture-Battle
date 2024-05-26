class keyMapper {
    jumpKey: string;
    moveLeftKey: string;
    moveRightKey: string;
    flashKey: string;

    constructor(payload: {
        jumpKey: string;
        moveLeftKey: string;
        moveRightKey: string;
        flashKey: string;
    }) {
        this.jumpKey = payload.jumpKey;
        this.moveLeftKey = payload.moveLeftKey;
        this.moveRightKey = payload.moveRightKey;
        this.flashKey = payload.flashKey;
    }

    remap(keyMap: {
        jumpKey?: string;
        moveLeftKey?: string;
        moveRightKey?: string;
        flashKey?: string;
    }) {
        if (keyMap.jumpKey) this.jumpKey = keyMap.jumpKey;
        if (keyMap.moveLeftKey) this.moveLeftKey = keyMap.moveLeftKey;
        if (keyMap.moveRightKey) this.moveRightKey = keyMap.moveRightKey;
        if (keyMap.flashKey) this.flashKey = keyMap.flashKey;
    }
}

export default keyMapper;
