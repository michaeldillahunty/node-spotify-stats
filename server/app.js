/// Packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const passport_spotify = require('passport-spotify');
/// Imports
const logger = require('./src/utils/logger.utils');
const connect = require('./src/connect.database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const init_passport = require('./src/utils/passport-setup.utils');

/// Routes
const auth_routes = require('./src/routes/auth.routes');
const spotify_routes = require('./src/routes/spotify.routes');	

// const spotify_routes = require('./src/routes/spotify.routes');

/// App Configurations
dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/src'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
	origin:'http://localhost:3000', // client port
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true
}));


app.set('trust proxy', 1);
app.use(session({
	secret: process.env.SESSION_KEY,
	resave: false,
	saveUninitialized: false, 
	store: MongoStore.create({
		mongoUrl: process.env.DB_URI,
		// ttl: 14*24*60*60, // 14 days 
		ttl: 10*60, // 10 minutes
		autoRemove: 'native'
	}),
	cookie: { 
		secure: false, 
		maxAge: 1000 * 60 * 60 * 24
	}
}));

// app.use(cookieParser());


app.use(passport.initialize());
app.use(passport.session());

// app.use('/', spotify_routes);
app.use('/auth', auth_routes);
app.use('/', spotify_routes);

app.listen(port, async () => {
    logger.info(`⚡️[server]: Server is running on : http://${host}:${port}`)
	await connect();
})