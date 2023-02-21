const SpotifyWebApi = require('spotify-web-api-node');

class Spotify extends SpotifyWebApi {
    constructor(clientId, clientSecret) {
        super({clientId: clientId, clientSecret: clientSecret});
    }

    connect() {
        return new Promise((resolve, reject) => this.clientCredentialsGrant().then((data, err) => {
            if (err) return reject(err);

            console.log('[DEBUG]: The access token expires in ' + data.body['expires_in'] + " seconds");
            console.log('[DEBUG]: The access token is ' + data.body['access_token']);

            this.setAccessToken(data.body['access_token']);

            resolve();
        }));
    }

    album(id, offset, limit) {
        return new Promise((resolve, reject) => this.getAlbumTracks(id, {
            offset: offset,
            limit: limit
        }).then(resolve).catch(reject));
    }

    playlist(id, offset, limit) {
        return new Promise((resolve, reject) => this.getPlaylistTracks(id, {
            offset: offset,
            limit: limit
        }).then(resolve).catch(reject));
    }

    track(id) {
        return new Promise(resolve => resolve(this.getTrack(id)));
    }

    searchTrack(query) {
        return new Promise(resolve => resolve(this.search(query, ["track"])))
    }
}

module.exports = Spotify;