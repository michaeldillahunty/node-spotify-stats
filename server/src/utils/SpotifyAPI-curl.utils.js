// const axios = require('axios');
// const { AxiosInstance, AxiosResponse } = axios;
// const logger = require('./logger.utils');

// class SpotifyApiHelper {
//     constructor(baseURL) {
//         this.http_client = axios.create({ 
//             baseURL, 
//             timeout: 5000,
//             headers: { 'Authorization': `Bearer ${access_token}` }
//         });
//     }
    
//     async SpotifUserGET(endpoint, options = {}) {
//         const base_user_url = 'https://api.spotify.com/v1/';
//         try {
//             const response = await this.http_client.get(endpoint, {  
//                 params: options, 
//                 headers: headers
//             });
//             return response.data;
//         } catch (e) {
//             logger.error(e.message);
//             throw new Error(`Failed to make GET Request: ${e.message}`);
//         }
//     }
// }

// module.exports = SpotifyApiHelper;  