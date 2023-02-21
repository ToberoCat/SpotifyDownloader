const parseArgs = require("./ArgumentParsing");
const Downloader = require("./spotify/PlaylistDownloader");
const yaml = require('js-yaml');
const fs = require('fs');

const map = new Map([
    ['url', null],
    ['output', null],
    ['workers', "5"],
    ['limit', "50"],
    ['skip', "0"]
]);

if (!parseArgs(map)) {
    console.log("Missing arguments. This tool requires --url and --output to work");
    console.log("You have to specify a url to a song, playlist or album in spotify and a output path");
    return;
}

const config = yaml.load(fs.readFileSync('../config.yml', 'utf8'));

const downloader = new Downloader( // ToDo: Check if the right types where specified before casting
    config["client-id"],
    config["client-secret"],
    "../" + map.get("output"),
    parseInt(map.get("workers")),
    parseInt(map.get("limit")),
    parseInt(map.get("skip")));

// Track: https://open.spotify.com/track/4CG1cTxooFGY1uOO1X2TnN
// Playlist: https://open.spotify.com/playlist/5j51VgrSn0OD6nsi2vlPH6
// Album: https://open.spotify.com/album/2tNqAqFWdyNe73qhneDy7g

const url = map.get("url");
const id = url.split("/").at(-1).split("?")[0];
let promise = null;


if (url.includes("playlist")) promise = downloader.downloadPlaylist(id);
else if (url.includes("track")) promise = downloader.downloadTrack(id);
else if (url.includes("album")) promise = downloader.downloadAlbum(id);
else {
    console.log("No valid spotify url found");
    return;
}
