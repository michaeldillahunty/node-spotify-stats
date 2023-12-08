// const mongoose = require('mongoose');
// const { FilterQuery } = mongoose;
// const logger = require('../utils/logger.utils');
// const SpotifyApiHelper = require('../utils/SpotifyAPI-curl.utils');

// class SpotifyService {
//     constructor() {
//         this.spotifyApiHelper = new SpotifyApiHelper();
//     }

//     /// Non-initialized params are "optional" | params with a value are default
//     async FetchUserTopItems(endpoint, type='tracks', time_range, limit, offset) {
//         const opt_params = {};
//         if (time_range) opt_params.time_range = time_range;
//         if (limit) opt_params.limit = limit;
//         if (offset) opt_params.offset = offset;
        
//         const response = await spotifyRequestUser.SpotifUserGET(endpoint, type, opt_params);
//         logger.info(response);
//         return await response;
//     }
    
//     // async FetchUserTopItem (endpoint, options = {}) {
//     //     try {
//     //         const response = await spotifyRequestUser.SpotifUserGET(endpoint, options);
//     //         logger.info(response);
//     //         return response;
//     //     } catch (e) {
//     //         logger.error(e.message);
//     //         throw new Error(`Failed to make GET Request: ${e.message}`);
//     //     }
//     // }
// } module.exports = SpotifyService;

