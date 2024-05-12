const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
var cors = require('cors');

const app = express();
const port = 3000;

app.use(cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  }));

// Set up Multer to handle multipart form data
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
    }
});
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/edge', upload.single('image'), async (req, res) => {
    // Check if file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    await new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['./test.py', `./uploads/${req.file.filename}`]);

        // Listen for stdout data from the Python script
        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        // Listen for stderr data from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Listen for process exit event
        pythonProcess.on('close', (code) => {
            console.log(`Python script process exited with code ${code}`);
            if (code === 0) {
                resolve(); // Resolve the promise if the process exits successfully
            } else {
                reject(`Python script process exited with code ${code}`); // Reject the promise if the process exits with an error
            }
        });
    });

    fs.unlinkSync(`./uploads/${req.file.filename}`);

    const jsonData = fs.readFileSync('./edge_info.json', 'utf-8');
    const parsedData = JSON.parse(jsonData);

    res.json(parsedData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
