import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import flash from 'express-flash';
// import favicon from 'serve-favicon';
import path from 'path';
import dotenv from 'dotenv';
import lessMiddleware from 'less-middleware';
import clinicRoutes from './routes/index';
import mongoose from 'mongoose';
import MongoOplog from 'mongo-oplog';
import cloudinary from 'cloudinary';
import multer from 'multer';
var upload = multer({ dest: './uploads/' });
var session = require('express-session');
var passport = require('passport');

// Configure .env path
dotenv.load({path: '.env'});
// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
export const oplog = MongoOplog(process.env.MONGODB_URI, { ns: 'polyclinic.clinics' });
oplog.tail();
oplog.on('update', (doc) => {
  console.log(doc);
});

const app = express();
const debug = Debug('clinicqueuesg:app');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

/* passport and session */
app.use(session( {secret: 'secret-name',
    name: 'cookie_name',
    resave: true,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/* Place below middleware parsers */
app.use('/', clinicRoutes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  console.log(err);
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
