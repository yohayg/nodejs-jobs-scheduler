const
    // http = require('http'),
    // path = require('path'),
    // methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    // session = require('express-session'),
    cors = require('cors'),
    // passport = require('passport'),
    errorhandler = require('errorhandler'),
    redisClient = require('./routes/redis-client'),
    redis = require('redis'),
    schedule = require('node-schedule');
// mongoose = require('mongoose'),

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('method-override')());
// app.use(express.static(__dirname + '/public'));

// app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
    app.use(errorhandler());
}
const client = redis.createClient(process.env.REDIS_URL);
const j = schedule.scheduleJob('* * * * * *', async () => {
    let current = Math.floor(Date.now()/1000);
    console.log("Current time: %s", current);
    const rawData = await redisClient.zRangeByScoreAsync("jobs", 0, current);
    if(rawData.length){
        console.log('The answer to life, the universe, and everything! %s', rawData);
        await redisClient.zRemRangeByScoreAsync("jobs", 0, current);
    }


});
if (isProduction) {
    // mongoose.connect(process.env.MONGODB_URI);
} else {
    // mongoose.connect('mongodb://localhost/conduit');
    // mongoose.set('debug', true);

}

// require('./models/User');
// require('./models/Article');
// require('./models/Comment');
// require('./config/passport');

// app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3001, function () {
    console.log('Listening on port ' + server.address().port);
});
