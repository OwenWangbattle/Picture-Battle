"use client";

import { ChangeEvent, useState } from "react";
import styles from "./page.module.scss";
import Canvas from "./canvas";

export default function mainPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [response, setResponse] = useState<any>(null);

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

        const formData = new FormData();
        formData.append("image", selectedFile);

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
                setResponse(data);
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
                <button onClick={handleUpload} disabled={uploading}>
                    Submit
                </button>
            </div>
            <div className={styles.canvasContainer}>
                {response && (
                    <Canvas
                        width={response.width}
                        height={response.height}
                        edges={response.edges}
                    />
                )}
            </div>
        </div>
    );
}
