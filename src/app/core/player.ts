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
    }

    CollisionHandler(collisionDetector: any) {
        let nextX = this.x + this.hSpeed;
        let nextY = this.y + this.vSpeed;

        // move only x coordinate, remain y the same
        const xOnlyQuery = {
            topLeft: {
                x: nextX,
                y: this.y,
            },
            bottomRight: {
                x: nextX + this.width,
                y: this.y + this.height,
            },
        };
        const xleftQuery = {
            topLeft: {
                x: this.x,
                y: this.y + 1,
            },
            bottomRight: {
                x: nextX,
                y: this.y + this.height - 1,
            },
        }
        const xrightQuery = {
            topLeft: {
                x: this.x + this.width,
                y: this.y + 1,
            },
            bottomRight: {
                x: nextX + this.width,
                y: this.y + this.height - 1,
            },
        }
        // move only y coordinate, remain x the same
        const yOnlyQuery = {
            topLeft: {
                x: this.x,
                y: nextY + 1,
            },
            bottomRight: {
                x: this.x + this.width,
                y: nextY + this.height - 1,
            },
        };
        const ytopQuery = {
            topLeft: {
                x: this.x + 1,
                y: this.y,
            },
            bottomRight: {
                x: this.x + this.width - 1,
                y: nextY,
            },
        }
        const ybottomQuery = {
            topLeft: {
                x: this.x + 1,
                y: this.y + this.height,
            },
            bottomRight: {
                x: this.x + this.width - 1,
                y: nextY + this.height,
            },
        }
        // move both x and y coordinates
        const xyQuery = {
            topLeft: {
                x: nextX,
                y: nextY,
            },
            bottomRight: {
                x: nextX + this.width,
                y: nextY + this.height,
            },
        };

        // detect collision
        const xleftCollision = collisionDetector.queryRightX(xleftQuery);
        const xrightCollision = collisionDetector.queryLeftX(xrightQuery);
        const ytopCollision = collisionDetector.queryBottomY(ytopQuery);
        const ybottomCollision = collisionDetector.queryTopY(ybottomQuery);
        const xyCollision =collisionDetector.queryXY(xyQuery, this.hSpeed, this.vSpeed);
        

        // to-do
        // we should not just revert to previous position when collision is detected
        // instead, it makes more sense to let the player move contact to the closest pixel
        // if (xCollision) {
        //     nextX = this.x;
        // }
        if (xleftCollision !== null ) {
            nextX = xleftCollision.x + 1;
        }
        if (xrightCollision !== null) {
            nextX = xrightCollision.x - this.width - 1;
        }
        if (ytopCollision !== null) {
            nextY =  ytopCollision.y + 1;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        }
        if (ybottomCollision !== null) {
            nextY =  ybottomCollision.y - this.height - 1;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        }
        if (xyCollision !== null && this.hSpeed > 0 && this.vSpeed > 0) {
            nextX = xyCollision.x - this.width;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        } else if ( xyCollision !== null && this.hSpeed < 0 && this.vSpeed > 0) {
            nextX = xyCollision.x;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        } else if ( xyCollision !== null && this.hSpeed > 0 && this.vSpeed < 0) {
            nextX = xyCollision.x - this.width;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        } else if ( xyCollision !== null && this.hSpeed < 0 && this.vSpeed < 0) {
            nextX = xyCollision.x;
            this.vSpeed = 0;
            this.jumpCounter = 0;
        }

        // set next coordinates
        this.x = nextX;
        this.y = nextY;
    }

    next_frame(collisionDetector: any, ctx: CanvasRenderingContext2D) {
        // consume pending actions
        this.hSpeed = 0;
        if (this.pendingAction.left) this.hSpeed = -this.moveSpeed;
        if (this.pendingAction.right) this.hSpeed = this.moveSpeed;

        // jump handle
        if (this.pendingAction.jump) {
            if (this.jumpCounter === 0) {
                // first jump
                this.jumpCounter += 1;
                this.vSpeed = -this.jumpSpeed;
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

        // render new position
        this.render(ctx);
    }

    // player actions
    moveLeft() {
        this.pendingAction.left = true;
        this.pendingAction.right = false;
    }

    doneMoveLeft() {
        this.pendingAction.left = false;
    }

    moveRight() {
        this.pendingAction.right = true;
        this.pendingAction.left = false;
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
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = prev_color;
    }

    erase(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(
            Math.floor(this.x),
            Math.floor(this.y),
            this.width,
            this.height + 1
        );
    }
}

export default Player;
