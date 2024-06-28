"use client";

import { ChangeEvent, useState } from "react";
import styles from "./page.module.scss";
import Canvas from "./canvas";
import Link from "next/link";
import { useMyContext } from "../MyContext";
interface IResizeImageOptions {
    maxSize: number;
    file: File;
}
const resizeImage = (settings: IResizeImageOptions) => {
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement("canvas");
    const dataURItoBlob = (dataURI: string) => {
        const bytes =
            dataURI.split(",")[0].indexOf("base64") >= 0
                ? atob(dataURI.split(",")[1])
                : unescape(dataURI.split(",")[1]);
        const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const max = bytes.length;
        const ia = new Uint8Array(max);
        for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    const resize = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/jpeg");
        return dataURItoBlob(dataUrl);
    };

    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }

        reader.onload = (readerEvent: any) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};

export default function mainPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>(null);

    const { state } = useMyContext();

    if (!state.socket) {
        window.location.href = "/";
    }

    if (state.socket && !state.host) {
        state.socket.on("map", (message) => {
            console.log(message);
            const img = new Image();
            img.src = message.img;
            setResponse({
                ...message.data,
                img: img,
            });
        });
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image to upload.");
            return;
        }

        setUploading(true);

        const img = (await resizeImage({
            file: selectedFile,
            maxSize: 800,
        })) as Blob;

        const formData = new FormData();
        formData.append("image", img, "user-image.png");

        try {
            const response = await fetch("api/edge", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                data.edges = data.edges.map((edge: number[]) => {
                    return { x: edge[1], y: edge[0] };
                });

                const reader = new FileReader();
                reader.onload = function (e: ProgressEvent<FileReader>) {
                    const result = e.target?.result as string;
                    const img = new Image();
                    img.src = result;
                    data.img = img;

                    setResponse(data);

                    if (state.socket && state.host) {
                        state.socket.emit("map confirm", {
                            data: data,
                            img: result,
                        });
                    }
                };
                reader.readAsDataURL(img);
            } else {
                alert("Error uploading image.");
            }
        } catch (error) {
            alert("Error uploading image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.input}>
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp"
                    onChange={handleFileChange}
                />
                <button
                    onClick={handleUpload}
                    disabled={uploading || !state.host}
                >
                    Submit
                </button>

                <div className={styles.settings}>
                    <Link href="./game/Settings">
                        <button>Settings</button>
                    </Link>
                </div>
            </div>

            <div className={styles.canvasContainer}>
                {response && (
                    <Canvas
                        width={response.width}
                        height={response.height}
                        edges={response.edges}
                        img={response.img}
                        socket={state.socket}
                        host={state.host}
                    />
                )}
            </div>
        </div>
    );
}
