const fetch = require('electron-fetch').default;

class SpotifyControls {
    /**
     * 
     * @param {OauthClient.user} token An authenticated user 
     */
    constructor(token) {
        this.token = token;
    }

    fetchPlaybackInfo() {
        this.fetchResource('get', '/me/player/currently-playing');
    }

    fetchPlaylistContents(playlistUri) {
        let id = playlistUri.split(":")[2];
        return this.fetchResource('get', `/playlists/${id}/tracks`);
    }

    enqueue(resourceUri){
        return this.fetchResource('post', `/me/player/queue?uri=${resourceUri}`);
    }

    nextSong() {
        this.fetchResource('post', '/me/player/next');
    }

    seekStart() {
        return this.fetchResource('put', `/me/player/seek?position_ms=${0}`);
    }

    pause() {
        this.fetchResource('put', '/me/player/pause');
    }

    play() {
        this.fetchResource('put', '/me/player/play');
    }

    fetchResource(method, endpoint) {
        const url = 'https://api.spotify.com/v1' + endpoint;
        const req = this.token.sign({
            method: method,
            url: url
        });
        console.log(`Fetching ${url}`);
        return fetch(url, {method: req.method, headers: req.headers}).then(val => {
            if (val.status != 204){
                console.log("We have something other than 204")
                return val.json();
            } else {
                console.log("returning promise");
                return new Promise(resolve => resolve('EMPTY'));
            }
        });
                // .then(json => {
                //     console.log(json);
                //     if (responseClbk != undefined) {
                //         //the calling method passed a callback and wishes to get a copy of the obtained data
                //         responseClbk(json);
                //     }
                // });
    }


}

module.exports = { SpotifyControls };