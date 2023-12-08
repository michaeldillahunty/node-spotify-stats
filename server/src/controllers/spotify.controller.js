// const SpotifyApiService = require('../services/spotify.service');
// const express = require('express');
// const logger = require('../utils/logger.utils');

// const spotifyService = new SpotifyApiService();

// const GetUserTopItems = async (req, res) => {
//     try {
//         const { type, time_range, limit, offset } = req.query;
//         const accessToken = req.session.accessToken; // Assuming the token is stored in the session
//         const headers = { 'Authorization': `Bearer ${accessToken}` };

//         const opt_params = { type, time_range, limit, offset };
        
//         // const opt_params = { type: type };
//         // if (time_range) opt_params.time_range = time_range;
//         // if (limit) opt_params.limit = limit;
//         // if (offset) opt_params.offset = offset;

//         const response = await spotifyRequestUser.SpotifyUserGET(`/me/top/${type}`, headers, opt_params);
//         res.json(response);
//     } catch (error) {
//         logger.error(error.message);
//         res.status(500).json({ error: error.message });
//     }
// }