import { start } from "repl";

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
        let nextX = Math.round(this.x + this.hSpeed);
        let nextY = Math.round(this.y + this.vSpeed);

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


        // move only y coordinate, remain x the same
        const yOnlyQuery = {
            topLeft: {
                x: this.x,
                y: nextY,
            },
            bottomRight: {
                x: this.x + this.width,
                y: nextY + this.height,
            },
        };

        // move both x and y coordinates
        // detect collision
        const startxyQuery = {
            topLeft:{
                x: nextX,
                y: nextY,
            },
            bottomRight:{
                x: nextX + this.width,
                y: nextY + this.height,
            },
        };
        let xtemp = false;
        let ytemp = false;
        let startvSpeed = this.vSpeed;
        let starthSpeed = this.hSpeed;
        let startnextX = nextX;
        let startnextY = nextY;
        const startxyCollision = collisionDetector.queryExist(startxyQuery);
        // to-do
        // we should not just revert to previous position when collision is detected
        // instead, it makes more sense to let the player move contact to the closest pixel
        if (startxyCollision !== false){
            if(this.hSpeed > 0){
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
                const xrightCollision = collisionDetector.queryLeftX(xrightQuery);
                if(xrightCollision !== null){
                    nextX = xrightCollision.x - this.width - 1;
                    this.hSpeed = 0;
                    xtemp = true;
                }
            } else if(this.hSpeed < 0){
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
                const xleftCollision = collisionDetector.queryRightX(xleftQuery);
                if(xleftCollision !== null){
                    nextX = xleftCollision.x + 1;
                    this.hSpeed = 0;
                    xtemp = true;
                }
            }
            if (this.vSpeed > 0){
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
                const ybottomCollision = collisionDetector.queryBottomY(ybottomQuery);
                if(ybottomCollision !== null){
                    nextY = ybottomCollision.y - this.height - 1;
                    this.vSpeed = 0;
                    this.jumpCounter = 0;
                    ytemp = true;
                }
            } else if(this.vSpeed < 0){
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
                if(ytopCollision !== null){
                    nextY = ytopCollision.y + 1;
                    this.vSpeed = 0;
                    ytemp = true;
                }
            }

        }
        let xyCollision1 = null;
        let xyCollision2 = null;
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
        const xyCollision = collisionDetector.queryExist(xyQuery);
        if(xyCollision !== false){
            console.log("ashdfhsdfhsuhfasufhuiafuasd")
            if(starthSpeed > 0){
                xyCollision1 = collisionDetector.queryLeftX(xyQuery);
                if(xyCollision1 !== null){
                    nextX = xyCollision1.x - this.width - 1;
                    this.hSpeed = 0;
                }
            } else if(starthSpeed < 0){
                xyCollision1 = collisionDetector.queryRightX(xyQuery);
                if(xyCollision1 !== null){
                    nextX = xyCollision1.x + 1;
                    this.hSpeed = 0;
                }
            }
            if(startvSpeed > 0){
                xyCollision2 = collisionDetector.queryTopY(xyQuery);
                if (xyCollision2 !== null){
                    nextY = xyCollision2.y - this.height - 1;
                    this.vSpeed = 0;
                }
            } else if(startvSpeed < 0){
                xyCollision2 = collisionDetector.queryBottomY(xyQuery);
                if (xyCollision2 !== null){
                    nextY = xyCollision2.y + 1;
                    this.vSpeed = 0;
                }
            }    
        }
        // set next coordinates
        this.x = nextX;
        this.y = nextY;
        const querytest = {
            topLeft: {
                x: this.x,
                y: this.y,
            },
            bottomRight: {
                x: this.x + this.width,
                y: this.y + this.height,
            },
        };
        const collisiontest = collisionDetector.queryExist(querytest);
        console.log(collisiontest);
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
}

export default Player;
