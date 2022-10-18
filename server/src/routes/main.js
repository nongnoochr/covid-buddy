const fs = require( 'fs' );
const path = require( 'path' );

const { Router } = require('express');
const timeout = require('connect-timeout');
const bodyParserJson = require('body-parser').json();

const { getfaqquestions, getfaqresponse, getqnaresponse } = require('./handler');

const router = Router();
const defaultTimeout = timeout('120s');

router.get('/getfaqquestions', bodyParserJson, haltOnTimedout, getfaqquestions);
router.get('/getfaqresponse', defaultTimeout, bodyParserJson, haltOnTimedout, getfaqresponse);
router.post('/getqnaresponse', defaultTimeout, bodyParserJson, haltOnTimedout, getqnaresponse);

// for any other requests, send `index.html` as a response
router.use( '*', ( req, res ) => {

    // read `index.html` file
    let indexHTML = fs.readFileSync( path.resolve( __dirname, './../../../client/build/index.html' ), {
        encoding: 'utf8',
    } );

    // set header and status
    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( indexHTML );
} );


module.exports= router;

// =================
// --- Helpers
// =================

// https://help.heroku.com/AXOSFIXN/why-am-i-getting-h12-request-timeout-errors-in-nodejs
// https://github.com/expressjs/timeout 
function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }