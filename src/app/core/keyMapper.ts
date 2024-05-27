class keyMapper {
    jumpKey: string;
    moveLeftKey: string;
    moveRightKey: string;
    attackKey: string;

    constructor(payload: {
        jumpKey: string;
        moveLeftKey: string;
        moveRightKey: string;
        attackKey: string;
    }) {
        this.jumpKey = payload.jumpKey;
        this.moveLeftKey = payload.moveLeftKey;
        this.moveRightKey = payload.moveRightKey;
        this.attackKey = payload.attackKey;
    }

    remap(keyMap: {
        jumpKey?: string;
        moveLeftKey?: string;
        moveRightKey?: string;
        attackKey?: string;
    }) {
        if (keyMap.jumpKey) this.jumpKey = keyMap.jumpKey;
        if (keyMap.moveLeftKey) this.moveLeftKey = keyMap.moveLeftKey;
        if (keyMap.moveRightKey) this.moveRightKey = keyMap.moveRightKey;
        if (keyMap.attackKey) this.attackKey = keyMap.attackKey;
    }
}

export default keyMapper;
