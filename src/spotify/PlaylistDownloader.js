const Spotify = require("./Spotify");
const SongDownloader = require("./SongDowloader");
const cliProgress = require('cli-progress');

class Downloader {
    constructor(clientId, clientSecret, musicPath, downloadWorkers, limit, offset) {
        this.musicPath = musicPath;
        this.downloadWorkers = downloadWorkers;
        this.limit = limit;
        this.offset = offset;
        this.queue = [];
        this.bar = null;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    async downloadPlaylist(id) {
        this.queue = await this.scrapeTracks(id);

        this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        this.bar.start(this.queue.length, 0);

        for (let i = 0; i < this.downloadWorkers; i++)
            this.nextPlaylistWorker(this.queue.length);
    }

    async downloadAlbum(id) {
        this.queue = await this.scrapeAlbumTracks(id);

        this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        this.bar.start(this.queue.length, 0);

        for (let i = 0; i < this.downloadWorkers; i++)
            this.nextAlbumWorker(this.queue.length);
    }

    async downloadTrack(id) {
        const track = await this.scrapeTrack(id);
        this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        this.bar.start(1, 0);

        const name = track.body.name;
        const query = `${name} ${track.body.artists[0].name}`;

        new SongDownloader(`${this.musicPath}/${name.replace(/[<>:"\/\\|?*]+/g, '')}.mp3`, query,
            () => {
                this.bar.setTotal(1);
                this.bar.stop();
            }, (err) => {
                console.log(err);
                this.bar.stop();
            });
    }

    nextPlaylistWorker(total) {
        if (this.queue.length === 0) {
            this.bar.setTotal(total);
            this.bar.stop();
            return;
        }
        const track = this.queue.pop();

        console.log(track);
        const name = track.track.name;
        const query = `${name} ${track.track.artists[0].name}`;

        new SongDownloader(`${this.musicPath}/${name.replace(/[<>:"\/\\|?*]+/g, '')}.mp3`, query, () => {
            this.bar.increment();
            this.nextPlaylistWorker(total);
        }, (err) => {
            console.log(err);
            this.bar.increment();
            this.nextPlaylistWorker(total);
        });
    }

    nextAlbumWorker(total) {
        if (this.queue.length === 0) {
            this.bar.setTotal(total);
            this.bar.stop();
            return;
        }
        const track = this.queue.pop();

        const name = track.name;
        const query = `${name} ${track.artists[0].name}`;

        new SongDownloader(`${this.musicPath}/${name.replace(/[<>:"\/\\|?*]+/g, '')}.mp3`, query, () => {
            this.bar.increment();
            this.nextAlbumWorker(total);
        }, (err) => {
            console.log(err);
            this.bar.increment();
            this.nextAlbumWorker(total);
        });
    }

    async scrapeTracks(id) {
        const api = new Spotify(this.clientId, this.clientSecret);
        await api.connect();

        let tracks = [];
        let items = [];
        let offset = this.offset;

        do {
            const json = await api.playlist(id, offset, this.limit);
            offset += this.limit;

            items = json.body.items;
            tracks = tracks.concat(items);
        } while (items.length !== 0);

        return tracks;
    }

    async scrapeAlbumTracks(id) {
        const api = new Spotify(this.clientId, this.clientSecret);
        await api.connect();

        let tracks = [];
        let items = [];
        let offset = this.offset;

        do {
            const json = await api.album(id, offset, this.limit);
            offset += this.limit;

            items = json.body.items;
            tracks = tracks.concat(items);
        } while (items.length !== 0);

        return tracks;
    }

    async scrapeTrack(id) {
        const api = new Spotify(this.clientId, this.clientSecret);
        await api.connect();

        return await api.track(id);
    }
}

module.exports = Downloader;