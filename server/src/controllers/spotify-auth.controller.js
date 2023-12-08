const authService = require('../services/spotify-auth.service');

const login = (req, res) => {
    authService.login(req, res);
};

const spotifyCallback = (req, res) => {
    // Logic for /spotify/callback route
    authService.spotifyCallback(req, res);
};

const refreshToken = (req, res) => {
    // Logic for /refresh_token route
    authService.refreshToken(req, res);
};

const currentUser = (req, res) => {
    // Logic for /currentUser route
    authService.currentUser(req, res);
};

const spotifyAuth = (req, res) => {
    // Logic for /spotify route
    authService.spotifyAuth(req, res);
};

module.exports = {
    login,
    spotifyCallback,
    refreshToken,
    currentUser,
    spotifyAuth
};
