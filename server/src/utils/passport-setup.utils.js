const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const SpotifyUser = require('../models/SpotifyUser.model');

const logger = require('./logger.utils');


passport.serializeUser((userProfile, done) => {
    // logger.info('Serialized user with id = ' + user.id);
    done(null, userProfile.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await SpotifyUser.findById(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (e) {
        logger.error(e); 
        done(e);
    }
});

passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: '/auth/spotify/callback'
      },
      async (accessToken, refreshToken, expires_in, profile, done) => {
        logger.info(`access token: ${accessToken}`)
        try {
            SpotifyUser.findOne({ spotifyId: profile.id }).then((curr_user) => {
            if (curr_user) {
                // user is already created
                logger.info(`User with id = ${profile.id} already exists`);
                done(null, curr_user);
            } else {
                logger.info(`Creating new user with id: ${profile.id}`);
                // else create new user
                new SpotifyUser({
                    id: profile.id,
                    external_urls: profile.external_urls,
                    name: profile.display_name,
                    href: profile.href,
                    images: profile.images,
                    country: profile.country,
                    followers: profile.followers.total,
                    product: profile.product,
                    email: profile.email
                }).save().then((new_spotify_user) => {
                    logger.info(`\nNew User Created: \n ${new_spotify_user}`);
                    done(null, new_spotify_user);
                });
                
            }});
        } catch (e) {
            logger.error(e.message);
        }
      }
    )
);