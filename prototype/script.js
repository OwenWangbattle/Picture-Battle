const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const fps = 50;

let intervalID = null;
let handleKeyDown = null;
let handleKeyUp = null;

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.height = 21;
        this.width = 11;

        this.cancelFactor = 0.4;

        this.gravity = 0.4;
        this.moveSpeed = 3;
        this.maxFallingSpeed = 9;
        this.jumpSpeed = -8.5;
        this.dJumpSpeed = -7;

        this.jumpCounter = 0;

        this.vSpeed = 0;

        this.pendingAction = {
            left: false,
            right: false,
            jump: false,
            release: false,
        };
    }

    next_step(pixels) {
        let nextX = this.x;
        let nextY = this.y;

        if (this.pendingAction.left) nextX -= this.moveSpeed;
        if (this.pendingAction.right) nextX += this.moveSpeed;

        if (this.pendingAction.jump) {
            if (this.jumpCounter === 0) {
                this.jumpCounter += 1;
                this.vSpeed = this.jumpSpeed;
            } else if (this.jumpCounter === 1) {
                this.jumpCounter += 1;
                this.vSpeed = this.dJumpSpeed;
            }
        }

        this.vSpeed = Math.min(
            this.maxFallingSpeed,
            this.vSpeed + this.gravity
        );

        if (this.pendingAction.release) {
            console.log("release!");
            if (this.vSpeed < 0) this.vSpeed *= this.cancelFactor;
        }
        // console.log(this.vSpeed);

        nextY += this.vSpeed;

        let flag = true;

        // detect collision
        for (const pixel of pixels) {
            const xCollision =
                nextX <= pixel[1] &&
                nextX + this.width >= pixel[1] &&
                this.y <= pixel[0] &&
                this.y + this.height >= pixel[0];
            const yCollision =
                this.x <= pixel[1] &&
                this.x + this.width >= pixel[1] &&
                nextY <= pixel[0] &&
                nextY + this.height >= pixel[0];
            const bothCollision =
                nextX <= pixel[1] &&
                nextX + this.width >= pixel[1] &&
                nextY <= pixel[0] &&
                nextY + this.height >= pixel[0];

            if (xCollision || yCollision || bothCollision) flag = false;

            if (xCollision) {
                // roll back to previous x, test only
                // should move contact to the pixel
                nextX = this.x;
            }

            if (yCollision || bothCollision) {
                // roll back to previous y, test only
                // should move contact to the pixel
                nextY = this.y;
                this.vSpeed = 0;
                this.jumpCounter = 0;
            }

            if (!flag) break;
        }

        ctx.clearRect(this.x, Math.floor(this.y), this.width, this.height + 1);

        this.x = nextX;
        this.y = nextY;

        this.render(pixels);

        this.pendingAction.jump = false;
        this.pendingAction.release = false;
    }

    render(edges) {
        // for (const edge of edges) {
        //     ctx.fillRect(edge[1], edge[0], 1, 1);
        // }

        ctx.fillStyle = "red";

        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "black";
    }
}

const start = async (edges) => {
    for (const edge of edges) {
        ctx.fillRect(edge[1], edge[0], 1, 1);
    }

    const player = new Player(0, 0);

    if (intervalID) clearInterval(intervalID);
    intervalID = setInterval(() => {
        player.next_step(edges);
    }, 1000 / fps);

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);

    handleKeyDown = (e) => {
        if (e.code === "ArrowLeft") {
            player.pendingAction.left = true;
        } else if (e.code === "ArrowRight") {
            player.pendingAction.right = true;
        } else if (e.shiftKey) {
            player.pendingAction.jump = true;
        }
    };

    handleKeyUp = (e) => {
        if (e.code === "ArrowLeft") {
            player.pendingAction.left = false;
        } else if (e.code === "ArrowRight") {
            player.pendingAction.right = false;
        } else if (e.key === "Shift") {
            player.pendingAction.release = true;
        }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
};

document.getElementById("uploader").addEventListener("click", async () => {
    let fileInput = document.getElementById("image");
    let file = fileInput.files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://127.0.0.1:3000/edge", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    canvas.width = data.width;
    canvas.height = data.height;
    start(data.edges);
});
