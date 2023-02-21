const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const BatchDownloader = require('../BatchDownloader');

async function downloadSong() {
    request('https://music.apple.com/at/playlist/unbenannte-playlist/pl.u-4JomXg2FJjmjeXX', (err, res, body) => {
        if (err) return console.log(err);

        console.log(`Status: ${res.statusCode}`);
        const $ = cheerio.load(body);
        let songName = null;
        const songListEl = $('.songs-list');

        const songsTitles = [];
        const songAuthors = [];
        let counter = 0;
        songListEl.find("a").each((i, el) => {
            if (!/songs-list /gm.test(el.parent.attribs.class)) return;
            songsTitles[counter] = el.children[0].data;
            counter += 1;
        });

        songListEl.find("div[data-testid=track-column-secondary]>div").each((i, el) => {
            $(el).find("span>a").slice(0, 1).each((k, el) => {
                songAuthors[i] = el.children[0].data
            });
        });

        const songs = [];
        for (let i = 0; i < songsTitles.length; i++) {
            songs.push(`${songsTitles[i]} ${songAuthors[i]}`);
        }

        new BatchDownloader(songs, 5, "C:\\Music").downloadPlaylist();
    });
}

downloadSong();