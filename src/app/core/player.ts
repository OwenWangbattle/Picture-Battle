class Player {
    // ---------- player status ----------
    // player position
    x: number;
    y: number;

    // player jump counter
    jumpCounter: number;

    // player vertical speed
    vSpeed: number;
    // player horizontal speed
    hSpeed: number;

    // player pending actions
    pendingAction: {
        left: boolean;
        right: boolean;
        jump: boolean;
        release: boolean;
    };

    onGround: boolean;

    coyote_time: {
        start: boolean;
        timer: Date | null;
    };

    // ---------- player static attributes ----------
    // player collision box
    height: number = 21;
    width: number = 11;

    // player jump release multiplier
    cancelFactor: number = 0.4;

    // player gravity
    gravity: number = 0.4;

    // player move speed
    moveSpeed: number = 3;
    // player max falling speed
    maxFallingSpeed: number = 9;
    // player first jump initial speed
    jumpSpeed: number = 8.5;
    // player double jump initial speed
    dJumpSpeed: number = 7;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

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

        this.coyote_time = {
            start: false,
            timer: null,
        };
    }

    CollisionHandler(collisionDetector: any) {
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
        const startxyCollision = collisionDetector.queryExist(startxyQuery);

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
                    collisionDetector.queryLeftX(xrightQuery);
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
                    collisionDetector.queryRightX(xleftQuery);
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
                    collisionDetector.queryBottomY(ybottomQuery);
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
                const ytopCollision = collisionDetector.queryTopY(ytopQuery);
                if (ytopCollision !== null) {
                    nextY = ytopCollision.y + 1;
                    this.vSpeed = 0;
                }
            }
        }

        this.x = nextX;
        this.y = nextY;
    }

    next_frame(collisionDetector: any, ctx: CanvasRenderingContext2D) {
        // consume pending actions
        this.hSpeed = 0;
        if (this.pendingAction.left) this.hSpeed = -this.moveSpeed;
        else if (this.pendingAction.right) this.hSpeed = this.moveSpeed;

        // jump handle
        if (this.pendingAction.jump) {
            if (this.jumpCounter === 0 || this.onGround) {
                // first jump
                this.jumpCounter = 1;
                this.vSpeed = -this.jumpSpeed;

                this.clearCoyoteTimer();
            } else if (this.jumpCounter === 1) {
                // double jump
                this.jumpCounter += 1;
                this.vSpeed = -this.dJumpSpeed;
            }
        }
        this.pendingAction.jump = false;

        // release handle
        this.vSpeed = Math.min(
            this.maxFallingSpeed,
            this.vSpeed + this.gravity
        );

        if (this.pendingAction.release) {
            if (this.vSpeed < 0) this.vSpeed *= this.cancelFactor;
        }
        this.pendingAction.release = false;

        // erase previous position
        this.erase(ctx);

        // calculate player's next position
        this.CollisionHandler(collisionDetector);

        this.onGround = collisionDetector.queryExist({
            topLeft: {
                x: this.x,
                y: this.y + this.height,
            },
            bottomRight: {
                x: this.x + this.width,
                y: this.y + this.height + 1,
            },
        });

        if (!this.onGround) {
            if (this.coyote_time.start) {
                if (!this.coyote_time.timer)
                    return console.error("coyote timer error!");

                let seconds =
                    (new Date().getTime() - this.coyote_time.timer.getTime()) /
                    1000;

                if (seconds > 0.08) {
                    this.jumpCounter = Math.max(1, this.jumpCounter);
                    this.clearCoyoteTimer();
                }
            } else this.startCoyoteTimer();
        } else this.clearCoyoteTimer();

        // render new position
        this.render(ctx);
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

        ctx.fillStyle = "red";
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
}

export default Player;
