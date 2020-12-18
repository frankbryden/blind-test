const fs = require('fs');
const ClientOAuth2 = require('client-oauth2');
const express = require('express')
const app = express()
const {shell} = require('electron');
const port = 5000;

const authFileName = 'spotify.auth';

class SpotifyAuthentication {
    constructor() {
        this.codeReceived = this.codeReceived.bind(this);
        this.authData = {
            code: '',
            accessToken: '',
            refreshToken: '',
            expiresAt: -1,
            originalUrl: null,
        };
        this.setupServer();
        this.readAuthFile();
        this.initAuthObject();
    }

    readAuthFile()  {
        try {
            const data = JSON.parse(fs.readFileSync(authFileName));
            this.authData = data;
        } catch(error) {
            console.log("no auth file found");
        }
        
    }

    initAuthObject() {
        this.spotifyAuth = new ClientOAuth2({
            clientId: process.env.spotifyClientId,
            clientSecret: process.env.spotifyClientSecret,
            accessTokenUri: 'https://accounts.spotify.com/api/token',
            authorizationUri: 'https://accounts.spotify.com/authorize',
            redirectUri: 'http://localhost:5000/auth',
            scopes: ['user-modify-playback-state', 'user-read-playback-state', 'user-read-email']
        });
    }

    authDataReceived(token) {
        this.authData.accessToken = token.accessToken;
        this.authData.refreshToken = token.refreshToken;
        this.authData.expiresAt = new Date().getTime() + token.data.expires_in*1000;
        console.log(`${new Date().getTime()} + ${token.data.expires_in*1000} = ${this.authData.expiresAt}`);
        this.writeAuthFile();
    }

    writeAuthFile() {
        console.log(this.authData);
        fs.writeFile(authFileName, JSON.stringify(this.authData), null, ()=>console.log("Wrote auth file"));
    }

    codeReceived(code, originalUrl) {
        this.authData.code = code;
        //needed by the oauth client library
        this.authData.originalUrl = originalUrl;
        this.getFirstAccessToken(this.authCompletedClbk);
        this.writeAuthFile();
    }

    setupServer() {
        app.get('/auth', (req, res) => {
            console.log("Code received!")
            this.codeReceived(req.query.code, req.originalUrl);
            res.send("<h1>Thank you for authenticating. You can return to the app.</h1>");
        });
        
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        });
    }

    getAccessToken(clbk) {
        const token = this.spotifyAuth.createToken(this.authData.accessToken, this.authData.refreshToken, 'bearer');
        if (new Date().getTime() > this.authData.expiresAt){
            console.log("Refreshing token...");
            token.refresh().then(token => {
                console.log("Token refreshed");
                this.authDataReceived(token);
                clbk(token);
            });
        }
        clbk(token);
    }

    getFirstAccessToken(clbk) {
        this.spotifyAuth.code.getToken(this.authData.originalUrl).then(user => {
            // user.refresh().then( updatedUser => {
            //     this.authData.accessToken = updatedUser.accessToken;
            //     this.authData.refreshToken = updatedUser.refreshToken;
            // })
            this.authDataReceived(user);
            clbk(user);
        });
    }

    authUser(clbk) {
        if (this.authData.code.length > 0) {
            console.log("user already authenticated");
            //either app crashed before first auth could be fetched, in that case fetch it
            if (this.authData.accessToken.length == 0) {
                this.getFirstAccessToken(clbk);
            } else {
                //this user has authenticated before. we might need to refresh the token
                //TODO find a better logic to decide if token should be refreshed
                this.getAccessToken(clbk);
            }
            return;
        }
        
        var uri = this.spotifyAuth.code.getUri()
        console.log(uri);
        this.authCompletedClbk = clbk;
        console.log(uri);
        shell.openExternal(uri);
        //window.open(uri);
        let token = this.spotifyAuth.createToken();
        //console.log(token);

    }
}

module.exports = {SpotifyAuthentication};