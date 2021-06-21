const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const cors = require('cors');
const timeout = require('connect-timeout');
var bodyParser = require('body-parser');

const {startService, getFAQQuestions,  getFAQResponseById, getResponse } = 
    require('./server/QnAService');

// ------------

// create express application
const app = express();

// allows/disallows cross-site communication
app.use(cors());
// const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://covid-buddy.herokuapp.com.herokuapp.com']
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("** Origin of request " + origin)
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       console.log("Origin acceptable")
//       callback(null, true)
//     } else {
//       console.log("Origin rejected")
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// app.use(cors(corsOptions));

const host = '0.0.0.0';
const PORT = process.env.PORT || 8080;

// serve static assets
app.get( /\.(js|css|map|ico)$/, express.static( path.resolve( __dirname, 'client/build' ) ) );
app.use('/images', express.static(path.resolve( __dirname, 'client/build/images' ) ));

// const pathStatic = path.join(__dirname,'client/build/static');
// console.log('pathStatic: ', pathStatic);
// app.use(express.static(pathStatic));

// https://help.heroku.com/AXOSFIXN/why-am-i-getting-h12-request-timeout-errors-in-nodejs
// https://github.com/expressjs/timeout 
function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }

app.get('/getfaqquestions', timeout('120s'), bodyParser.json(), haltOnTimedout, async (req, res, next) => {

    try {
        const category = req.query.category || 'All' ;
        const faqquestions = getFAQQuestions(category);
        res.send(faqquestions);
    } catch(err) {
        return next(err)
    }
});

app.get('/getfaqresponse', timeout('120s'), bodyParser.json(), haltOnTimedout, async (req, res, next) => {

    const id = req.query.id || -1;

    try {
        const faqresponse = await getFAQResponseById(id);
        res.send(faqresponse);

    } catch(err) {
        return next(err)
    }

});

app.get('/getqnaresponse', timeout('120s'), bodyParser.json(), haltOnTimedout, async (req, res, next) => {

    const msg = req.query.msg || '';
    let ansRes = null;
    if (msg) {
        try {
            ansRes = await getResponse(msg);
            res.send(ansRes);
        } catch(err) {
            return next(err)
        }
    }
});

// for any other requests, send `index.html` as a response
app.use( '*', ( req, res ) => {

    // read `index.html` file
    let indexHTML = fs.readFileSync( path.resolve( __dirname, 'client/build/index.html' ), {
        encoding: 'utf8',
    } );

    // set header and status
    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( indexHTML );
} );

// -------------
const startApp = async () => {
    await startService();

    // run express server on port 9000
    app.listen( PORT, host, () => {
        console.log( `Express server started at http://localhost:${PORT}` );
    } );

}

startApp();


