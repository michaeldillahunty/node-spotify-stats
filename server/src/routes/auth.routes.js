const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/logger.utils');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const spotify = require('passport-spotify')
const request = require('request');
const querystring = require('querystring');
const SpotifyUserModel = require('../models/SpotifyUser.model');
const axios = require('axios');  
// const SpotifyWebAPI = require('spotify-web-api-node');
var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; 
var redirect_uri = process.env.REDIRECT_URI;


const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}



// router.use(cookieParser());
const stateKey = 'spotify_auth_state';

router.get('/login', function(req, res) {
   var state = generateRandomString(16);
   res.cookie(stateKey, state);
 
   var scope = 'user-read-private user-read-email user-top-read playlist-modify-public';
   res.redirect('https://accounts.spotify.com/authorize?' +
     querystring.stringify({
      response_type: 'code',
      client_id: client_id, // Your Spotify client ID
      scope: scope,
      redirect_uri: redirect_uri,  // Your backend route that will handle the redirect from Spotify
      state: state
   }));
});

router.get('/spotify/callback', async (req, res) => {
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;

   if (state === null || state !== storedState) {
      res.redirect('/' +
         querystring.stringify({ error: 'state_mismatch' })
      );
   } else {
      res.clearCookie(stateKey);
      try {
         const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
               code: code,
               redirect_uri: redirect_uri,
               grant_type: 'authorization_code',
            },
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
               'Authorization': 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            },
         });

         const { access_token, refresh_token } = tokenResponse.data;

         // Make a request to Spotify's API to get the user profile
         const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
           headers: { 'Authorization': `Bearer ${access_token}` },
         });

         const userProfile = profileResponse.data;
         const saveOrUpdateUser = {
            id: userProfile.id,
            display_name: userProfile.display_name,
            name: userProfile.display_name, // Adjust as necessary
            href: userProfile.href,
            images: userProfile.images,
            product: userProfile.product,
            email: userProfile.email,
            external_urls: userProfile.external_urls
         }

         await SpotifyUserModel.findOneAndUpdate(
            { id: userProfile.id },
            saveOrUpdateUser,
            { upsert: true, new: true, setDefaultsOnInsert: true }
         );


       

         // Save the session data
         req.session.userProfile = userProfile;
         req.session.accessToken = access_token;
         req.session.refreshToken = refresh_token;

         // Save the session before redirecting
         req.session.save(err => {
            if (err) {
               console.error('Session save error:', err);
               res.redirect(`http://localhost:3000/error=${encodeURIComponent('session_error')}`);
            } else {
               // Redirect the user to the frontend with tokens in hash fragments or via a secure method
               res.redirect('http://localhost:3000/');
            }
         });
      } catch (error) {
         console.error('Error in Spotify callback:', error);
         res.redirect(`http://localhost:3000/#error=${encodeURIComponent('authentication_failed')}`);
      }
   }
});

router.get('/refresh_token', function(req, res) {
   var refresh_token = req.query.refresh_token;
   var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
         'content-type': 'application/x-www-form-urlencoded',
         'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
         grant_type: 'refresh_token',
         refresh_token: refresh_token
      },
      json: true
   };

   request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
         var access_token = body.access_token;
         var refresh_token = body.refresh_token;
         
         req.session.userInfo = {
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
         };
         res.send({
            'access_token': access_token,
            'refresh_token': refresh_token
         });
      }
   });
});

router.post('/logout', (req, res, next) => {
   if (!req.session.userProfile) {
      return res.redirect('http://localhost:3000/'); // Return immediately after redirecting
   }
   req.logout( function(err) {
      if (err) { 
         logger.error(err); 
         return next(err); 
      }
      return res.redirect('http://localhost:3000/');
   });
   
   req.session.destroy(err => {  // Destroy the session after logging out
       if (err) {
           logger.error(err);
           return next(err);
       }
       res.clearCookie('connect.sid');
       res.redirect('http://localhost:3000/');
   });
});

// router.get('/currentUser', (req, res) => {
//    if (req.session && req.session.userProfile) {
//        res.send(req.session.userProfile);
//    } else {
//        res.status(404).send('User profile not found');
//    }
// });


// router.get('/spotify',passport.authenticate('spotify', 
//    {
//       scope: ['user-read-email', 'user-read-private'], 
//       showDialog: true
//    }
// ));
module.exports = router;