const ytdl = require('ytdl-core');
const fs = require("fs");
const yt = require("youtube-search-without-api-key");
const {search} = require("youtube-search-without-api-key");
const ffmpeg = require('fluent-ffmpeg');

class SongDowloader {
    constructor(toFile, songQuery, success, err) {
        this.toFile = toFile;
        this.search(songQuery)
            .then(async (url) => {
                await this.download(url);
                success();
            })
            .catch(err);
    }

    search(query) {
        return new Promise(async (resolve, reject) => {
            const videos = await yt.search(query);
            if (videos.length === 0) reject("No videos found");
            resolve(videos[0].url);
        });
    }

    download(url) {
        return new Promise(async (resolve, reject) =>
            ffmpeg(ytdl(url, {quality: "highestaudio"}))
                .audioBitrate(128)
                .save(this.toFile)
                .on("end", resolve)
                .on("error", reject));
    }
}

module.exports = SongDowloader;