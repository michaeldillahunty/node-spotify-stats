const express = require('express');
const router = express.Router();
const logger = require('../utils/logger.utils');
const axios = require('axios');
const url = require('url');
const ListModel = require('../models/SaveList.model');
const SpotifyUser = require('../models/SpotifyUser.model');
// const headers = { headers: {'Authorization': `Bearer ${access_token}` }};
// logger.info(`${access_token}`);

router.get('/user/profile', (req, res) => {
    if (req.session.userProfile) {
        res.json(req.session.userProfile);
    } else {
        res.status(401).json({ error: 'User undefined - Login and try again' });
    }
})

/** 
 * @openapi
 *      https://api.spotify.com/v1/me/top/{type}?time_range={val}&
 *   
 * @params
 *  @param type (str): artists | tracks
 *      @default null
 *  @param time_range (str): long_term (several years) | medium_term (6 months) | short_term (4 weeks)
 *      @default medium_term
 *  @param limit (int): max number of items to return 
 *      @default 20
 *  @param offset (int): index of the first item to return 
 *      @default 20
 *       @min 1
 *       @max 50
 */
router.get('/topItems/:type', (req, res) => {
    if (req.session) { // check if the user is logged in
        const opt_params = {};

        if (req.query.time_range) opt_params.time_range = req.query.time_range;
        if (req.query.limit) opt_params.limit = req.query.limit;
        const type = req.params.type; 

        if (!['tracks', 'artists'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type specified' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        // SPOTIFY's EXAMPLE https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10
        // axios.get(`https://api.spotify.com/v1/me/top/${type}?${searchParams}`, {
        axios.get(`https://api.spotify.com/v1/me/top/${type}?time_range=${req.query.time_range}&limit=${req.query.limit}`, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
        }) .then(response => {
            return res.send(response.data)
        }) .catch(error => {
            res.status(error.response?.status || 500).json({ error: error.message });
        });
    } else {
        res.status(401).json({ error: 'User undefined - Login and try again' });
    }
});

router.post('/saveList', async (req, res) => {
    const { items, user } = req.body;

    try {
        const new_list = await ListModel.create({ user, items }); // Create a document for the List being saved in the DB
        await SpotifyUser.findOneAndUpdate({ id: user }, { $push: { lists: new_list._id } })
        res.status(200).send("List saved successfully");
    } catch (error) {
        console.error('Error saving list:', error);
        res.status(500).send("Error saving list");
    }
});

router.get('/getLists/:userId', async (req, res) => {
    try {
        const spotifyUserId = req.params.userId;
        logger.info(`Fetching lists for user ID: ${spotifyUserId}`);
        
        // Fetch all lists associated with the Spotify user ID
        const lists = await ListModel.find({ user: spotifyUserId }); // fetch all lists that contain the spotify userID
        if (lists.length === 0) {
            return res.status(404).json({ message: 'No lists found for the provided Spotify user ID.' });
        }
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ message: 'Internal server error', error: error });
    }
});

module.exports = router;