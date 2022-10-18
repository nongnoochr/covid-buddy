const path = require( 'path' );
const express = require( 'express' );
const cors = require('cors');

const { startService } = require('./server/src/QnAService');
const router = require('./server/src/routes/main');

// ------------

// create express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(router);

// -------------
const startApp = async () => {
    await startService();

    // run express server on port 9000
    app.listen( PORT, host, () => {
        console.log( `Express server started at http://localhost:${PORT}` );
    } );

}

startApp();


