import Player from "./player";
import KeyMapper from "./keyMapper";
import CollisionHandler from "./CollisionHandler";
import my2DBinarySearch from "./bs2d";
import { MeleeWeapon, RemoteWeapon } from "./weapon";
import Renderer from "./renderer";
import keyMap from "../../local/keymap.json";
const fps = 50;

class gameGlobals {
    player: Player;
    collisionHandler: CollisionHandler | null;
    intervalID: NodeJS.Timeout | null;
    ctx: CanvasRenderingContext2D;
    renderer: Renderer;

    handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null;
    handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null;

    constructor(
        player: Player,
        collisionHandler: CollisionHandler | null,
        intervalID: NodeJS.Timeout | null,
        handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null,
        handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null,
        ctx: CanvasRenderingContext2D,
        renderer: Renderer
    ) {
        this.player = player;
        this.collisionHandler = collisionHandler;
        this.intervalID = intervalID;
        this.handleKeyDown = handleKeyDown;
        this.handleKeyUp = handleKeyUp;
        this.ctx = ctx;
        this.renderer = renderer;
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
        this.collisionHandler = null;
    }
}

let currentGlobals: gameGlobals | null;

let deadplayer: Player;

// game logics per frame
const gameFrame = () => {
    if (!currentGlobals) {
        console.error("game globals does not exist!");
        return;
    }
    if (!currentGlobals.collisionHandler) {
        console.error("game collision Handler does not exist!");
        return;
    }

    currentGlobals.player.next_frame(
        currentGlobals.collisionHandler,
        currentGlobals.ctx
    );

    deadplayer.next_frame(currentGlobals.collisionHandler, currentGlobals.ctx);

    currentGlobals.renderer.render(currentGlobals.ctx);
};

const start_game = async (
    ctx: CanvasRenderingContext2D,
    edges: { x: number; y: number }[]
) => {
    // clean up if there are left overs
    if (currentGlobals) cleanup_game();

    // set up 2d binary search
    const backgroundCollision = new my2DBinarySearch(edges);
    const collisionHandler = new CollisionHandler(backgroundCollision);
    const renderer = new Renderer();

    // create player
    const player = new Player({
        x: 20,
        y: 20,
        index: 0,
    });
    collisionHandler.addCollisionObject("player", player);
    renderer.addItem(player);

    // const weapon = new MeleeWeapon(
    //     "test",
    //     5,
    //     21,
    //     10,
    //     -1,
    //     collisionHandler,
    //     player
    // );

    const weapon = new RemoteWeapon(
        "test",
        5,
        10,
        10,
        collisionHandler,
        player
    );
    player.bind_to_weapon(weapon);
    renderer.addItem(weapon);

    deadplayer = new Player({
        x: 100,
        y: 20,
        index: 1,
    });
    collisionHandler.addCollisionObject("player", deadplayer);
    renderer.addItem(deadplayer);

    // create keyboard mapper

    const keyMapper = new KeyMapper();

    // keyboard handler
    let handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === keyMapper.moveLeftKey) {
            player.moveLeft();
        } else if (e.code === keyMapper.moveRightKey) {
            player.moveRight();
        } else if (e.code === keyMapper.jumpKey) {
            player.jump();
        } else if (e.code === keyMapper.attackKey) {
            player.attack();
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
        collisionHandler,
        null,
        handleKeyDown,
        handleKeyUp,
        ctx,
        renderer
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

const createRenderingObject = function (className: any, ...args: any[]) {
    if (!currentGlobals) {
        console.error("current globals does not exist");
        return;
    }
    const myclass = new className(...Array.from(arguments).slice(1));
    if (myclass.zIndex === undefined) myclass.zIndex = 0;
    if (myclass.destoryed === undefined) myclass.destoryed = false;
    currentGlobals.renderer.addItem(myclass);
    return myclass;
};

export { start_game, cleanup_game, createRenderingObject };
