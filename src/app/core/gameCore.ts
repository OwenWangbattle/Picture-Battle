import Player from "./player";
import KeyMapper from "./keyMapper";
import CollisionHandler from "./CollisionHandler";
import my2DBinarySearch from "./bs2d";
import { MeleeWeapon, RemoteWeapon } from "./weapon";
import Renderer from "./renderer";
import frameAdvancer from "./frameAdvancer";
import { Socket } from "socket.io-client";

enum gameAction {
    moveLeft = 1,
    moveRight,
    jump,
    attack,
}

interface RemotePayload {
    keyDown: gameAction | null;
    keyUp: gameAction | null;
}

const fps = 50;

class gameGlobals {
    player: Player;
    collisionHandler: CollisionHandler | null;
    intervalID: NodeJS.Timeout | null;
    ctx: CanvasRenderingContext2D;
    renderer: Renderer;
    FrameAdvancer: frameAdvancer;
    socket: Socket;

    handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null;
    handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null;

    constructor(
        player: Player,
        collisionHandler: CollisionHandler | null,
        intervalID: NodeJS.Timeout | null,
        handleKeyDown: ((this: Document, ev: KeyboardEvent) => any) | null,
        handleKeyUp: ((this: Document, ev: KeyboardEvent) => any) | null,
        ctx: CanvasRenderingContext2D,
        renderer: Renderer,
        FrameAdvancer: frameAdvancer,
        socket: Socket
    ) {
        this.player = player;
        this.collisionHandler = collisionHandler;
        this.intervalID = intervalID;
        this.handleKeyDown = handleKeyDown;
        this.handleKeyUp = handleKeyUp;
        this.ctx = ctx;
        this.renderer = renderer;
        this.FrameAdvancer = FrameAdvancer;
        this.socket = socket;
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

let remotePlayer: Player;

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

    remotePlayer.next_frame(
        currentGlobals.collisionHandler,
        currentGlobals.ctx
    );

    currentGlobals.renderer.render();
};

const playerInitPos = {
    x: 20,
    y: 20,
};

const remotePlayerInitPos = {
    x: 100,
    y: 20,
};

const start_game = async (
    ctx: CanvasRenderingContext2D,
    edges: { x: number; y: number }[],
    img: HTMLImageElement,
    socket: Socket,
    host: boolean
) => {
    // clean up if there are left overs
    if (currentGlobals) cleanup_game();

    // set up 2d binary search
    const backgroundCollision = new my2DBinarySearch(edges);
    const collisionHandler = new CollisionHandler(backgroundCollision);
    const renderer = new Renderer(img, ctx);
    const FrameAdvancer = new frameAdvancer([]);

    // create player
    const player = new Player({
        ...(host ? playerInitPos : remotePlayerInitPos),
        index: 0,
    });
    collisionHandler.addCollisionObject("player", player);
    renderer.addItem(player);
    FrameAdvancer.addItem(player);

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
        10,
        10,
        10,
        collisionHandler,
        player
    );
    player.bind_to_weapon(weapon);
    renderer.addItem(weapon);

    remotePlayer = new Player({
        ...(host ? remotePlayerInitPos : playerInitPos),
        index: 1,
    });

    const weaponRemote = new RemoteWeapon(
        "testRemote",
        10,
        10,
        10,
        collisionHandler,
        remotePlayer
    );
    remotePlayer.bind_to_weapon(weaponRemote);
    renderer.addItem(weaponRemote);

    collisionHandler.addCollisionObject("player", remotePlayer);
    renderer.addItem(remotePlayer);
    FrameAdvancer.addItem(remotePlayer);

    // create keyboard mapper

    const keyMapper = new KeyMapper();

    // keyboard handler
    let handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === keyMapper.moveLeftKey) {
            player.moveLeft();
            socket.emit("game payload", {
                keyDown: gameAction.moveLeft,
            } as RemotePayload);
        } else if (e.code === keyMapper.moveRightKey) {
            player.moveRight();
            socket.emit("game payload", {
                keyDown: gameAction.moveRight,
            } as RemotePayload);
        } else if (e.code === keyMapper.jumpKey) {
            player.jump();
            socket.emit("game payload", {
                keyDown: gameAction.jump,
            } as RemotePayload);
        } else if (e.code === keyMapper.attackKey) {
            player.attack();
            socket.emit("game payload", {
                keyDown: gameAction.attack,
            } as RemotePayload);
        }
    };

    let handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === keyMapper.moveLeftKey) {
            player.doneMoveLeft();
            socket.emit("game payload", {
                keyUp: gameAction.moveLeft,
            } as RemotePayload);
        } else if (e.code === keyMapper.moveRightKey) {
            player.doneMoveRight();
            socket.emit("game payload", {
                keyUp: gameAction.moveRight,
            } as RemotePayload);
        } else if (e.code === keyMapper.jumpKey) {
            player.release();
            socket.emit("game payload", {
                keyUp: gameAction.jump,
            } as RemotePayload);
        }
    };

    // remote player action handler
    socket.on("player action", (payload: RemotePayload) => {
        console.log(payload);
        if (payload.keyDown) {
            if (payload.keyDown.valueOf() === gameAction.moveLeft.valueOf()) {
                remotePlayer.moveLeft();
            } else if (
                payload.keyDown.valueOf() === gameAction.moveRight.valueOf()
            ) {
                remotePlayer.moveRight();
            } else if (
                payload.keyDown.valueOf() === gameAction.jump.valueOf()
            ) {
                remotePlayer.jump();
            } else if (
                payload.keyDown.valueOf() === gameAction.attack.valueOf()
            ) {
                remotePlayer.attack();
            }
        }
        if (payload.keyUp) {
            if (payload.keyUp.valueOf() === gameAction.moveLeft.valueOf()) {
                remotePlayer.doneMoveLeft();
            } else if (
                payload.keyUp.valueOf() === gameAction.moveRight.valueOf()
            ) {
                remotePlayer.doneMoveRight();
            } else if (payload.keyUp.valueOf() === gameAction.jump.valueOf()) {
                remotePlayer.release();
            }
        }
    });

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
        renderer,
        FrameAdvancer,
        socket
    );

    // ctx.drawImage(img, 0, 0);

    // draw background
    // for (const edge of edges) {
    //     ctx.fillRect(edge.x, edge.y, 1, 1);
    // }

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

    // if (myclass.lastX === undefined) myclass.lastX = myclass.x;
    // if (myclass.lastY === undefined) myclass.lastY = myclass.y;
    currentGlobals.renderer.addItem(myclass);
    return myclass;
};

export { start_game, cleanup_game, createRenderingObject };
