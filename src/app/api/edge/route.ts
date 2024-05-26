import { NextResponse } from "next/server";

import fs from "fs";
import path from "path";
const { spawn } = require("child_process");

export async function POST(req: Request) {
    const image = (await req.formData()).get("image") as File;

    if (!image) return NextResponse.json({ msg: "No Image" }, { status: 500 });

    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const imagePath = path.join(uploadsDir, image.name);
    fs.writeFileSync(imagePath, buffer);

    await new Promise((resolve, reject) => {
        const pythonProcess = spawn(`${process.env.PYTHON_CMD}`, [
            "./src/img_process/test.py",
            `./public/uploads/${image.name}`,
        ]);

        pythonProcess.stdout.on("data", (data: any) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on("data", (data: any) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on("close", (code: any) => {
            console.log(`Python script process exited with code ${code}`);
            if (code === 0) {
                resolve(true);
            } else {
                reject(`Python script process exited with code ${code}`);
            }
        });
    });

    fs.unlinkSync(`./public/uploads/${image.name}`);

    const jsonData = fs.readFileSync("./edge_info.json", "utf-8");
    const parsedData = JSON.parse(jsonData);
    fs.unlinkSync(`./edge_info.json`);

    return NextResponse.json(parsedData);
}
