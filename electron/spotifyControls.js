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
        this.fetchResource('get', '/player/currently-playing');
    }

    enqueue(){
        this.fetchResource('post', '/player/queue?uri=spotify:track:0afhq8XCExXpqazXczTSve');
    }

    nextSong() {
        this.fetchResource('post', '/player/next');
    }

    pause() {
        this.fetchResource('put', '/player/pause');
    }

    fetchResource(method, endpoint) {
        const url = 'https://api.spotify.com/v1/me' + endpoint;
        const req = this.token.sign({
            method: method,
            url: url
        });
        fetch(url, {method: req.method, headers: req.headers}).then(val => val.text())
                .then(json => {});
    }


}

module.exports = { SpotifyControls };