import CollidableObject from "./CollidableObject";
import CollisionHandler from "./CollisionHandler";
import {
    DamagableObject,
    MeleeWeapon,
    MeleeWeaponSlash,
    Weapon,
} from "./weapon";

class Player extends CollidableObject {
    // ---------- player status ----------
    // player position
    // x: number;
    // y: number;

    index: number;

    // player jump counter
    jumpCounter: number;

    // player vertical speed
    vSpeed: number;
    // player horizontal speed
    hSpeed: number;

    zIndex: number;

    // player pending actions
    pendingAction: {
        left: boolean;
        right: boolean;
        jump: boolean;
        release: boolean;
    };

    onGround: boolean;

    // which direction does player face
    static FACE = {
        LEFT: Symbol("left"),
        RIGHT: Symbol("right"),
    };
    face: Symbol;

    coyote_time: {
        start: boolean;
        timer: Date | null;
    };

    weapon: Weapon | null;
    health: number;
    invincible: boolean;

    destoryed: boolean;

    // ---------- player static attributes ----------
    // player collision box
    static height: number = 21;
    static width: number = 11;

    // player jump release multiplier
    static cancelFactor: number = 0.4;

    // player gravity
    static gravity: number = 0.4;

    // player move speed
    static moveSpeed: number = 3;
    // player max falling speed
    static maxFallingSpeed: number = 9;
    // player first jump initial speed
    static jumpSpeed: number = 8.5;
    // player double jump initial speed
    static dJumpSpeed: number = 7;

    static coyote_time_limit: number = 0.08; //seconds

    constructor(payload: {
        x: number;
        y: number;
        index: number;
        zIndex?: number;
        health?: number;
    }) {
        const x = payload.x;
        const y = payload.y;
        const index = payload.index;
        const zIndex = payload.zIndex || 0;
        const health = payload.health || 100;

        super(x, y, Player.height, Player.width, 0);

        this.index = index;

        this.jumpCounter = 0;

        this.vSpeed = 0;
        this.hSpeed = 0;

        this.pendingAction = {
            left: false,
            right: false,
            jump: false,
            release: false,
        };

        this.onGround = true;
        this.face = Player.FACE.LEFT;

        this.coyote_time = {
            start: false,
            timer: null,
        };

        this.weapon = null;
        this.health = health;
        this.invincible = false;

        this.zIndex = zIndex;
        this.destoryed = false;
    }

    bind_to_weapon(weapon: Weapon) {
        this.weapon = weapon;
    }

    CollisionHandler(collisionDetector: CollisionHandler) {
        let nextX = Math.round(this.x + this.hSpeed);
        let nextY = Math.round(this.y + this.vSpeed);

        const startxyQuery = {
            topLeft: {
                x: nextX,
                y: nextY,
            },
            bottomRight: {
                x: nextX + this.width,
                y: nextY + this.height,
            },
        };
        const startxyCollision =
            collisionDetector.backgroundCollision.queryExist(startxyQuery);

        if (startxyCollision !== false) {
            if (this.hSpeed > 0) {
                const xrightQuery = {
                    topLeft: {
                        x: this.x + this.width,
                        y: this.y,
                    },
                    bottomRight: {
                        x: nextX + this.width,
                        y: this.y + this.height,
                    },
                };
                const xrightCollision =
                    collisionDetector.backgroundCollision.queryLeftX(
                        xrightQuery
                    );
                if (xrightCollision !== null) {
                    nextX = xrightCollision.x - this.width - 1;
                    this.hSpeed = 0;
                }
            } else if (this.hSpeed < 0) {
                const xleftQuery = {
                    topLeft: {
                        x: nextX,
                        y: this.y,
                    },
                    bottomRight: {
                        x: this.x,
                        y: this.y + this.height,
                    },
                };
                const xleftCollision =
                    collisionDetector.backgroundCollision.queryRightX(
                        xleftQuery
                    );
                if (xleftCollision !== null) {
                    nextX = xleftCollision.x + 1;
                    this.hSpeed = 0;
                }
            }
            if (this.vSpeed > 0) {
                const ybottomQuery = {
                    topLeft: {
                        x: nextX,
                        y: this.y + this.height,
                    },
                    bottomRight: {
                        x: nextX + this.width,
                        y: nextY + this.height,
                    },
                };
                const ybottomCollision =
                    collisionDetector.backgroundCollision.queryBottomY(
                        ybottomQuery
                    );
                if (ybottomCollision !== null) {
                    nextY = ybottomCollision.y - this.height - 1;
                    this.vSpeed = 0;

                    this.jumpCounter = 0;
                }
            } else if (this.vSpeed < 0) {
                const ytopQuery = {
                    topLeft: {
                        x: nextX,
                        y: nextY,
                    },
                    bottomRight: {
                        x: nextX + this.width,
                        y: this.y,
                    },
                };
                const ytopCollision =
                    collisionDetector.backgroundCollision.queryTopY(ytopQuery);
                if (ytopCollision !== null) {
                    nextY = ytopCollision.y + 1;
                    this.vSpeed = 0;
                }
            }
        }

        this.x = nextX;
        this.y = nextY;
    }

    WeaponCollision(collisionDetector: CollisionHandler) {
        if (this.invincible) return;
        const items = collisionDetector.queryCollisionItems(this.index, [
            "attack",
        ]);
        for (let i = 0; i < items.length; ++i) {
            const item = items[i].object as unknown as DamagableObject;
            // melee weapon should not be able to damage player itself
            if (item instanceof MeleeWeaponSlash)
                if (
                    (item as MeleeWeaponSlash).belong.player.index ===
                    this.index
                )
                    continue;

            // but remote weapon could
            this.health -= item.damage;

            console.log(`dealt ${item.damage} damage to ${this.index}`);

            this.invincible = true;
            setTimeout(() => {
                this.invincible = false;
            }, 1000);
        }
    }

    next_frame(
        collisionDetector: CollisionHandler,
        ctx: CanvasRenderingContext2D
    ) {
        // consume pending actions
        this.hSpeed = 0;
        if (this.pendingAction.left) this.hSpeed = -Player.moveSpeed;
        else if (this.pendingAction.right) this.hSpeed = Player.moveSpeed;

        // jump handle
        if (this.pendingAction.jump) {
            if (this.jumpCounter === 0 || this.onGround) {
                // first jump
                this.jumpCounter = 1;
                this.vSpeed = -Player.jumpSpeed;

                this.clearCoyoteTimer();
            } else if (this.jumpCounter === 1) {
                // double jump
                this.jumpCounter += 1;
                this.vSpeed = -Player.dJumpSpeed;
            }
        }
        this.pendingAction.jump = false;

        // release handle
        this.vSpeed = Math.min(
            Player.maxFallingSpeed,
            this.vSpeed + Player.gravity
        );

        if (this.pendingAction.release) {
            if (this.vSpeed < 0) this.vSpeed *= Player.cancelFactor;
        }
        this.pendingAction.release = false;

        // handle player facing direction
        if (this.hSpeed > 0) this.face = Player.FACE.RIGHT;
        else if (this.hSpeed < 0) this.face = Player.FACE.LEFT;

        // erase previous position
        this.erase(ctx);

        // calculate player's next position
        this.CollisionHandler(collisionDetector);
        this.WeaponCollision(collisionDetector);

        this.onGround = collisionDetector.backgroundCollision.queryExist({
            topLeft: {
                x: this.x,
                y: this.y + this.height,
            },
            bottomRight: {
                x: this.x + this.width,
                y: this.y + this.height + 1,
            },
        });

        // handle coyote time
        if (!this.onGround) {
            if (this.coyote_time.start) {
                if (!this.coyote_time.timer)
                    return console.error("coyote timer error!");

                let seconds =
                    (new Date().getTime() - this.coyote_time.timer.getTime()) /
                    1000;

                if (seconds > Player.coyote_time_limit) {
                    this.jumpCounter = Math.max(1, this.jumpCounter);
                    this.clearCoyoteTimer();
                }
            } else this.startCoyoteTimer();
        } else this.clearCoyoteTimer();

        // render new position
        // this.render(ctx);
    }

    // player actions
    moveLeft() {
        this.pendingAction.left = true;
        // this.pendingAction.right = false;
    }

    doneMoveLeft() {
        this.pendingAction.left = false;
    }

    moveRight() {
        this.pendingAction.right = true;
        // this.pendingAction.left = false;
    }

    doneMoveRight() {
        this.pendingAction.right = false;
    }

    jump() {
        this.pendingAction.jump = true;
    }

    release() {
        this.pendingAction.release = true;
    }

    // rendering functions
    render(ctx: CanvasRenderingContext2D) {
        const prev_color = ctx.fillStyle;

        ctx.fillStyle = this.health > 0 ? "green" : "red";
        ctx.fillRect(this.x, this.y, this.width + 1, this.height + 1);
        ctx.fillStyle = prev_color;
    }

    erase(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(
            Math.floor(this.x),
            Math.floor(this.y),
            this.width + 1,
            this.height + 1
        );
    }

    startCoyoteTimer() {
        this.coyote_time.start = true;
        this.coyote_time.timer = new Date();
    }

    clearCoyoteTimer() {
        this.coyote_time.start = false;
        this.coyote_time.timer = null;
    }

    attack() {
        if (!this.weapon) return;
        this.weapon.attack();
    }
}

export default Player;
