var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config  = require('./config');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = 3000;
// const connectionString='mongodb+srv://agata:agata@cluster0.zjjhjkr.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect('mongodb+srv://agata:agata@cluster0.zjjhjkr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => {
    console.log("db connected")
    const db = client.db(config.dbName);
    const collectionBooking = db.collection(config.dbCollectionBooking);
    const dbCollectionFlightDetailsDatabase = db.collection(config.dbCollectionFlightDetailsDatabase);
    const dbCollectionUsers = db.collection(config.dbCollectionUsers);
    app.locals[config.dbCollectionFlightDetailsDatabase] = dbCollectionFlightDetailsDatabase;
    app.locals[config.dbCollectionBooking] = collectionBooking;
    app.locals[config.dbCollectionUsers] = dbCollectionUsers;
  }).catch(
    err => {
      console.log(
        "Error in DB connection : " + JSON.stringify(err, undefined, 2)
      );
      })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use((req, res, next) => {
  const collectionBooking = app.locals[config.dbCollectionBooking];
  req.collection = collectionBooking;
  next();
})

app.use((req, res, next) => {
  const collectionFlightDetailsDatabase = app.locals[config.dbCollectionFlightDetailsDatabase];
  req.collectionFlightDetailsDatabase = collectionFlightDetailsDatabase;
  next();
})

app.use((req, res, next) => {
  const collectionUsers = app.locals[config.dbCollectionUsers];
  req.collectionUsers = collectionUsers;
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port,(err) => {
  if(err) {
      return console.log(`Something went wrong: ${err}`);
  }
  return console.log(`Listening on port ${port}`);
});
module.exports = app;
