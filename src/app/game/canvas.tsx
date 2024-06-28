"use client";

import { useEffect, useRef } from "react";
import { cleanup_game, start_game } from "../core/gameCore";

import styles from "./canvas.module.scss";
import { Socket } from "socket.io-client";

type propsType = {
    edges: { x: number; y: number }[];
    width: number;
    height: number;
    img: HTMLImageElement;
    socket: Socket | null;
    host: boolean;
};

export default function Canvas(props: propsType) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context || !props.socket) return;

        start_game(context, props.edges, props.img, props.socket, props.host);

        return () => {
            cleanup_game();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={props.width}
            height={props.height}
            className={styles.canvas}
        ></canvas>
    );
}
