const cliProgress = require("cli-progress");
const SongDownloader = require("./SongDowloader");
const fs = require("fs");

class BatchDownloader {
    constructor(queue, downloadWorkers, musicPath) {
        this.queue = queue;
        this.downloadWorkers = downloadWorkers;
        this.musicPath = musicPath;
    }

    async downloadPlaylist() {
        this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        this.bar.start(this.queue.length, 0);

        for (let i = 0; i < this.downloadWorkers; i++)
            this.nextPlaylistWorker(this.queue.length);
    }

    nextPlaylistWorker(total) {
        if (this.queue.length === 0) {
            this.bar.setTotal(total);
            this.bar.stop();
            return;
        }
        const track = this.queue.pop();

        const query = `${track}`;
        const path = `${this.musicPath}/${track.replace(/[<>:"\/\\|?*]+/g, '')}.mp3`;

        if (fs.existsSync(path)) {
            this.bar.increment();
            this.nextPlaylistWorker(total);
        }
        new SongDownloader(path, query,
            () => {
                this.bar.increment();
                this.nextPlaylistWorker(total);
            }, (err) => {
                console.error(err);
                this.queue.push(track);
                this.nextPlaylistWorker(total);
            });
    }
}

module.exports = BatchDownloader;