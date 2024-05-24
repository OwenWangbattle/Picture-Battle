"use client";

import { useEffect, useRef } from "react";
import { cleanup_game, start_game } from "../core/gameCore";

import styles from "./canvas.module.scss";

type propsType = {
    edges: { x: number; y: number }[];
    width: number;
    height: number;
};

export default function Canvas(props: propsType) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        start_game(context, props.edges);

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
