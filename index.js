const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

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

    res.status(200).json({
        status: 'success'
    });
});

// Start the server on 0.0.0.0
const PORT = 80;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
