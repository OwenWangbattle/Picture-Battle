class keyMapper {
    jumpKey: string;
    moveLeftKey: string;
    moveRightKey: string;

    constructor(payload: {
        jumpKey: string;
        moveLeftKey: string;
        moveRightKey: string;
    }) {
        this.jumpKey = payload.jumpKey;
        this.moveLeftKey = payload.moveLeftKey;
        this.moveRightKey = payload.moveRightKey;
    }

    remap(keyMap: {
        jumpKey?: string;
        moveLeftKey?: string;
        moveRightKey?: string;
    }) {
        if (keyMap.jumpKey) this.jumpKey = keyMap.jumpKey;
        if (keyMap.moveLeftKey) this.moveLeftKey = keyMap.moveLeftKey;
        if (keyMap.moveRightKey) this.moveRightKey = keyMap.moveRightKey;
    }
}

export default keyMapper;
