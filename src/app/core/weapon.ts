import CollidableObject from "./CollidableObject";
import CollisionHandler from "./CollisionHandler";
import { createRenderingObject } from "./gameCore";
import Player from "./player";

class Weapon {
    name: string;

    player: Player;
    collisionHandler: CollisionHandler;

    static STATUS = Object.freeze({
        ATTACK: Symbol("attack"),
        FREE: Symbol("free"),
    });

    status: Symbol;

    constructor(
        name: string,
        collisionHandler: CollisionHandler,
        player: Player
    ) {
        this.name = name;
        this.status = Weapon.STATUS.FREE;
        this.collisionHandler = collisionHandler;
        this.player = player;
    }

    attack() {
        throw "Weapon Class attack method is not overriden!";
    }

    render(ctx: CanvasRenderingContext2D) {
        throw "Weapon Class render method is not overriden!";
    }
}

class DamagableObject extends CollidableObject {
    damage: number;

    constructor(
        x: number,
        y: number,
        height: number,
        width: number,
        angle: number,
        damage: number
    ) {
        super(x, y, height, width, angle);
        this.damage = damage;
    }
}

class MeleeWeaponSlash extends DamagableObject {
    belong: MeleeWeapon;

    constructor(
        x: number,
        y: number,
        height: number,
        width: number,
        angle: number,
        damage: number,
        belong: MeleeWeapon
    ) {
        super(x, y, height, width, angle, damage);
        this.belong = belong;
    }

    render(ctx: CanvasRenderingContext2D) {
        const prev_color = ctx.fillStyle;

        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.width + 1, this.height + 1);
        ctx.fillStyle = prev_color;
    }
}

class MeleeWeapon extends Weapon {
    slash: MeleeWeaponSlash | null;

    slashWidth: number;
    slashHeight: number;
    damage: number;
    zIndex: number;

    constructor(
        name: string,
        slashWidth: number,
        slashHeight: number,
        damage: number,
        zIndex: number,
        collisionHandler: CollisionHandler,
        player: Player
    ) {
        super(name, collisionHandler, player);
        this.slash = null;
        this.slashWidth = slashWidth;
        this.slashHeight = slashHeight;
        this.damage = damage;
        this.zIndex = zIndex;
    }

    attack() {
        if (this.status !== Weapon.STATUS.FREE) return;
        this.status = Weapon.STATUS.ATTACK;
        this.slash = new MeleeWeaponSlash(
            this.player.x + this.player.width,
            this.player.y,
            this.slashHeight,
            this.slashWidth,
            0,
            this.damage,
            this
        );
        const index = this.collisionHandler.addCollisionObject(
            "attack",
            this.slash
        );
        setTimeout(() => {
            this.collisionHandler.removeCollisionObject(index);
            this.slash = null;
            this.status = Weapon.STATUS.FREE;
        }, 500);
    }

    update(ctx: CanvasRenderingContext2D) {
        if (!this.slash) return;

        // ctx.clearRect(
        //     this.slash.x,
        //     this.slash.y,
        //     this.slash.width + 1,
        //     this.slash.height + 1
        // );
        this.slash.x = this.player.x + this.player.width;
        this.slash.y = this.player.y;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.update(ctx);
        this.slash?.render(ctx);
    }
}

class Bullet extends DamagableObject {
    speed: number;
    direction: number;
    collisionHandler: CollisionHandler;
    index: number;

    zIndex: number;

    destoryed: boolean;

    constructor(
        x: number,
        y: number,
        height: number,
        width: number,
        angle: number,
        damage: number,
        speed: number,
        direction: number,
        collisionHandler: CollisionHandler,
        zIndex: number
    ) {
        super(x, y, height, width, angle, damage);
        this.speed = speed;
        this.direction = direction;
        this.collisionHandler = collisionHandler;

        this.index = collisionHandler.addCollisionObject("attack", this);
        this.destoryed = false;
        this.zIndex = zIndex;
    }

    next_frame(ctx: CanvasRenderingContext2D) {
        if (this.destoryed) return;
        // ctx.clearRect(this.x, this.y, this.width + 1, this.height + 1);

        // to do
        // handle direction

        this.x = this.x + this.speed;

        if (this.x < 0 || this.x > 1000 || this.y < 0 || this.y > 2000)
            this.destory();
        if (
            this.collisionHandler.backgroundCollision.queryExist({
                topLeft: {
                    x: this.x,
                    y: this.y,
                },
                bottomRight: {
                    x: this.x + this.width,
                    y: this.y + this.height,
                },
            })
        )
            this.destory();
    }

    render(ctx: CanvasRenderingContext2D) {
        this.next_frame(ctx);
        if (this.destoryed) return;

        const prev_color = ctx.fillStyle;

        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.width + 1, this.height + 1);
        ctx.fillStyle = prev_color;
    }

    destory() {
        this.collisionHandler.removeCollisionObject(this.index);
        this.destoryed = true;
    }
}

class RemoteWeapon extends Weapon {
    bulletWidth: number;
    bulletHeight: number;
    damage: number;

    constructor(
        name: string,
        bulletWidth: number,
        bulletHeight: number,
        damage: number,
        collisionHandler: CollisionHandler,
        player: Player
    ) {
        super(name, collisionHandler, player);
        this.bulletHeight = bulletHeight;
        this.bulletWidth = bulletWidth;
        this.damage = damage;
    }

    attack() {
        if (this.status !== Weapon.STATUS.FREE) return;
        this.status = Weapon.STATUS.ATTACK;

        createRenderingObject(
            Bullet,
            this.player.x + this.player.width + 1,
            this.player.y,
            this.bulletHeight,
            this.bulletWidth,
            0,
            this.damage,
            10,
            0,
            this.collisionHandler,
            1
        );

        setTimeout(() => {
            this.status = Weapon.STATUS.FREE;
        }, 1000);
    }

    update(ctx: CanvasRenderingContext2D) {
        // const updated: Bullet[] = [];
        // for (const bullet of this.bullets) {
        //     bullet.next_frame(ctx);
        //     if (bullet.destoryed) continue;
        //     updated.push(bullet);
        // }
        // this.bullets = updated;
    }

    render(ctx: CanvasRenderingContext2D) {
        // this.update(ctx);
        // for (const bullet of this.bullets) bullet.render(ctx);
    }
}

export { MeleeWeapon, RemoteWeapon, Weapon, DamagableObject, MeleeWeaponSlash };
