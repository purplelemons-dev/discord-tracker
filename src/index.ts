
import express from "express";
import fs from "fs";

const app = express();
const PORT = 10022;

let links: {
    // id to ips that have accessed the link
    [id: string]: string[];
} = {};

app.get("/", (req, res) => {
    const stuff = JSON.stringify(links, null, 2);
    // generate a new unique id for the link
    const uid = Math.random().toString(36).substring(2, 12);
    links[uid] = [];

    res.send(`<textarea style="height: 12rem; length: 48rem">${stuff}</textarea><p></p><script>document.querySelector("p").innerHTML = "You can access the link from <a href='/${uid}'>" + window.location + "${uid}</a>";</script>`);
});

/*
app.get("/:id", (req, res) => {
    res.header("Content-Type", "image/png");
    res.send(fs.readFileSync("src/script.js"));

});
*/

app.get("/:id", (req, res) => {
    const { id } = req.params;
    if (!links[id]) {
        res.send("Link not found");
        return;
    }

    // send a pixel as a beacon
    res.header("Content-Type", "image/png");
    res.send(fs.readFileSync("src/pixel.png"));

    console.log(`cf-connecting-ip: ${req.headers["cf-connecting-ip"]}`);
    console.log(`x-forwarded-for: ${req.headers["x-forwarded-for"]}`);
    console.log(`req.ip: ${req.ip}`);
    console.log(`req.socket.remoteAddress: ${req.socket.remoteAddress}`);
    console.log("\nHeaders:", JSON.stringify(req.headers, null, 2))

    const ip = req.headers["cf-connecting-ip"] as string || req.headers["x-forwarded-for"] as string || req.ip;

    if (ip && !links[id].includes(ip)) {
        links[id].push(ip);
    }

});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
});
