const crypto = require('crypto');
const dotenv = require('dotenv');
const querystring = require('querystring');
const logger = require('../utils/logger.utils');
const axios = require('axios');
dotenv.config();

const stateKey = 'spotify_auth_state';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;

const generateRandomString = length => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length); // return required number of characters
};

const getAuthToken = async (code, client_id, client_secret, redirect_uri) => {
    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64')
        },
        data: new URLSearchParams({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }).toString()
    };

    try {
        const response = await axios(authOptions);
        return response.data; // Contains access_token, refresh_token, etc.
    } catch (error) {
        console.error('Error getting auth token from Spotify:', error);
        throw error;
    }
};

const login = (req, res) => {
    logger.warn(`[/auth/login]`);
    const state = generateRandomString(16);
    logger.info(state);
    res.cookie(stateKey, state);

    const scope = ['user-read-private', 'user-read-email', 'user-top-read', 'playlist-modify-public'];
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
};

const spotifyCallback = (req, res) => {
    // Implement spotifyCallback logic
};

const refreshToken = (req, res) => {
    // Implement refreshToken logic
};

const currentUser = (req, res) => {
    // Implement currentUser logic
};

const spotifyAuth = (req, res) => {
    // Implement spotifyAuth logic
};

module.exports = {
    getAuthToken,
    login,
    spotifyCallback,
    refreshToken,
    currentUser,
    spotifyAuth
};
