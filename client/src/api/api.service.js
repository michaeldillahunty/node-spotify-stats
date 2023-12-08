// import axios_service from './axios.service';
// import axios from 'axios';

// class ApiService {    
//     handleSpotifyLogin = async () => {
//         try {
//             // const response = await axios.get('http://localhost:3000/auth/login'); // ! CORS error
//             // console.log(`response: ${response.data}`);
//             // return response.data;
//             // console.log(`[fetchSpotifyUserData] response: [${response}]`)

//             /**
//              * ! Redirects to Spotify Account Authorization page
//              * ! After authorizing account -> #error=state_mismatch header in url 
//              */
//             window.location.href = 'http://localhost:8000/auth/spotify'; 
//         } catch (e) {
//             console.error(`[fetchSpotifyUserData - API Service] ${e.message}`);
//             return null;
//         }
//     }
// }

// export default new ApiService();