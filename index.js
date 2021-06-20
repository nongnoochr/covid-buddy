const express = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );
const cors = require('cors');
const timeout = require('connect-timeout');
var bodyParser = require('body-parser');

const {getFAQQuestions,  getFAQResponseById, getResponse } = 
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

app.get('/getfaqquestions', (req, res) => {

    const category = req.query.category || 'All' ;
    const faqquestions = getFAQQuestions(category);
    res.send(faqquestions);
});

app.get('/getfaqresponse', (req, res) => {

    const id = req.query.id || -1;
    const faqresponse = getFAQResponseById(id);
    res.send(faqresponse);
});

app.get('/getqnaresponse', timeout('120s'), bodyParser.json(), haltOnTimedout, async (req, res, next) => {

    const msg = req.query.msg || '';
    let ansRes = null;
    if (msg) {
        try {
            ansRes = await getResponse(msg);
        } catch(err) {
            return next(err)
        }
    }
    res.send(ansRes);
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

// run express server on port 9000
app.listen( PORT, host, () => {
    console.log( `Express server started at http://localhost:${PORT}` );
} );

// -------------------
// const express = require('express');
// const path = require('path');
// const app = express();
// // const helmet = require('helmet') // creates headers that protect from attacks (security)
// // const cors = require('cors')  // allows/disallows cross-site communication
// app.use(express.json()); // Used to parse JSON bodies
// app.use(express.urlencoded({ extended: true })); 

// // --> Add this
// // ** MIDDLEWARE ** //
// // const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://shrouded-journey-38552.herokuapp.com']
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     console.log("** Origin of request " + origin)
// //     if (whitelist.indexOf(origin) !== -1 || !origin) {
// //       console.log("Origin acceptable")
// //       callback(null, true)
// //     } else {
// //       console.log("Origin rejected")
// //       callback(new Error('Not allowed by CORS'))
// //     }
// //   }
// // }
// // app.use(helmet())
// // --> Add this
// // app.use(cors(corsOptions))

// app.use(express.static(path.join(__dirname, 'client/build')));
// // Handle React routing, return all requests to React app
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });

// // // --> Add this
// // if (process.env.NODE_ENV === 'production') {
// //   // Serve any static files
// //   app.use(express.static(path.join(__dirname, 'client/build')));
// // // Handle React routing, return all requests to React app
// //   app.get('*', function(req, res) {
// //     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// //   });
// // }

// const PORT = process.env.PORT || 8080
// app.listen(PORT, (req, res) => {
//     console.log(`server listening on port: ${PORT}`)
//   });



// ------------

// // // Create express app
// // const path = require('path');

// // const express = require('express');
// // const app = express();

// // // -------
// // // Server port
// // const port = 8080;
// // // var port = process.env.PORT || curPort;
// // app.set('port', (port));

// // app.listen(port, () => {
// //     console.log(`Server now listening at http://localhost:${port}`);
// //  });

// // // -------

// // const pathIndex = path.join(__dirname, './client/build/index.html');
// // console.log('pathIndex', pathIndex);

// // app.use('./client/build', express.static(path.join(__dirname,'public')));


// // // Root endpoint
// // app.get('/', (req, res, next) => {
// //     res.sendFile(pathIndex);
// // });

// // // Root endpoint
// // app.get('*', (req, res, next) => {
// //     res.sendFile(pathIndex);
// // });

// // // Default response for any other request
// // app.use((req, res) => {
// //     res.status(404);
// // });



// // // app.use(express.json()); // Used to parse JSON bodies

