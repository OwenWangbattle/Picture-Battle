import Player from "./player";
import my2DBinarySearch from "./bs2d";
import KeyMapper from "./keyMapper";

const fps = 50;

class gameGlobals {
    player: Player;
    detector: my2DBinarySearch | null;
    intervalID: NodeJS.Timeout | null;
    ctx: CanvasRenderingContext2D;

    handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null;
    handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null;

    constructor(
        player: Player,
        detector: my2DBinarySearch | null,
        intervalID: NodeJS.Timeout | null,
        handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null,
        handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null,
        ctx: CanvasRenderingContext2D
    ) {
        this.player = player;
        this.detector = detector;
        this.intervalID = intervalID;
        this.handleKeyDown = handleKeyDown;
        this.handleKeyUp = handleKeyUp;
        this.ctx = ctx;
    }

    cleanup() {
        if (this.intervalID) clearInterval(this.intervalID);
        if (this.handleKeyDown)
            document.removeEventListener("keydown", this.handleKeyDown);
        if (this.handleKeyUp)
            document.removeEventListener("keyup", this.handleKeyUp);

        this.intervalID = null;
        this.handleKeyDown = null;
        this.handleKeyUp = null;
        this.detector = null;
    }
}

let currentGlobals: gameGlobals | null;

// game logics per frame
const gameFrame = () => {
    if (!currentGlobals) {
        console.error("game globals does not exist!");
        return;
    }

    currentGlobals.player.next_frame(
        currentGlobals.detector,
        currentGlobals.ctx
    );
};

const start_game = async (
    ctx: CanvasRenderingContext2D,
    edges: { x: number; y: number }[]
) => {
    // clean up if there are left overs
    if (currentGlobals) cleanup_game();

    // create player
    const player = new Player(20, 20);

    // set up 2d binary search
    const detector = new my2DBinarySearch(edges);

    // create keyboard mapper
    const keyMapper = new KeyMapper({
        jumpKey: "ShiftLeft",
        moveLeftKey: "ArrowLeft",
        moveRightKey: "ArrowRight",
    });

    // keyboard handler
    let handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === keyMapper.moveLeftKey) {
            player.moveLeft();
        } else if (e.code === keyMapper.moveRightKey) {
            player.moveRight();
        } else if (e.code === keyMapper.jumpKey) {
            player.jump();
        }
    };

    let handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === keyMapper.moveLeftKey) {
            player.doneMoveLeft();
        } else if (e.code === keyMapper.moveRightKey) {
            player.doneMoveRight();
        } else if (e.code === keyMapper.jumpKey) {
            player.release();
        }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // create game globals
    currentGlobals = new gameGlobals(
        player,
        detector,
        null,
        handleKeyDown,
        handleKeyUp,
        ctx
    );

    // draw background
    for (const edge of edges) {
        ctx.fillRect(edge.x, edge.y, 1, 1);
    }

    // start the game loop
    let intervalID = setInterval(() => {
        gameFrame();
    }, 1000 / fps);

    // add intervalID to globals
    currentGlobals.intervalID = intervalID;
};

const cleanup_game = async () => {
    if (!currentGlobals) return;
    currentGlobals.cleanup();
    currentGlobals = null;
};

export { start_game, cleanup_game };
