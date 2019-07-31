console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser')

const moment = require('moment');

let sha256 = require('js-sha256');
const SALT = "ALL YOUR BASE ARE BELONG TO US";

// Initialise postgres client
const configs = {
    user: 'donc',
    host: '127.0.0.1',
    database: 'medtrack_db',
    port: 5432,
    password: 'password'
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'))

app.use(cookieParser());
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);



/**
 * ===================================
 * Routes
 * ===================================
 */

//create new medication
app.post('/meds', (request, response) => {
    var newMed = request.body;
    let userId = request.cookies['User'];
    // console.log( newMed );
    // console.log("user Id " + userId);
    // console.log(typeof userId);
    const queryString = 'INSERT INTO medication (name, dose, dose_category, time_interval, start_time, user_id) VALUES ($1, $2, $3, $4, $5, $6)';
    let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, newMed.start_time, userId];
    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(res);
            /*const data = {
                artist : res.rows[0]
            }
            console.log(data);*/
            //response.send("New medication has been created!");
            response.redirect(`/meds/${userId}`);
        }

    });
});

app.get('/meds/new', (request, response) => {
    response.render('new');
});

//page for all medication of user
app.get('/meds/:id', (request, response) => {

    console.log(response.body);

    const queryString = "SELECT * FROM medication WHERE user_id=$1";

    const values = [parseInt(request.params.id)];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);

        } else {
            //console.log(res.rows);

            // let newStart = moment(res.rows[0].start_time).add(res.rows[0].time_interval, 'h').local().format();
            // console.log("new start" + newStart);
            if(res.rows[0] === undefined){
                const data = {
                    medData : res.rows
                }
                response.render('userpage', data);
            } else {



                //find out when the time to next pill
                for( let i= 0; i< res.rows.length; i++) {
                    let timeNextPill = res.rows[i].start_time;
                    res.rows[i]['nextTime'] = moment(timeNextPill).toNow(true);
                }

                //find shortest time to next pill
                let min = res.rows[0].start_time, max = res.rows[0].start_time;

                for (let i = 0, len=res.rows.length; i < len; i++) {
                    let v = res.rows[i].start_time;
                    min = (v < min) ? v : min;
                    max = (v > max) ? v : max;
                }

                let minDuration = min - Date.now();
                console.log("minDuration " + minDuration);
                let minMili = moment.duration(minDuration).asMilliseconds();
                console.log("minMili " + minMili);
                //let nextPill = moment(res.rows[0].start_time).toNow();
                //let currentTime = moment();
                //console.log(nextPill);
                //console.log(currentTime);
                // console.log("next time " + res.rows[0].nextTime);

                const data = {
                    medData : res.rows,
                    minTime : minMili
                }
                response.render('userpage', data);
            }

        }
    });
});

//register user
app.post('/users', (request, response) => {
    // hash the password
    let hashedPassword = sha256( request.body.password + SALT );

    const queryString = "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *";

    const values = [request.body.name, hashedPassword];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log("YAY");
            console.log(res.rows[0] );

            let hashedLogin = sha256("you are in" + res.rows[0].id + SALT);


            // check to see if err is null

            // they have successfully registered, log them in
            response.cookie('loggedin', hashedLogin);
            response.cookie('User', res.rows[0].id);
            //response.send('worked');
            response.redirect('/meds/' + res.rows[0].id);
        }
    });
});

//checking login
app.post('/users/logincheck', (request, response) => {
    // hash the password
    let hashedPassword = sha256( request.body.password + SALT );
    console.log(request.body);

    const queryString = "SELECT * FROM users WHERE name=$1 AND password=$2";

    const values = [request.body.name, hashedPassword];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);

        } else {
            if (res.rows[0] === undefined){
                response.send("Sorry, the user name/password was incorrect.");
            } else {
                console.log("YAY");
                console.log(res.rows);

                let hashedLogin = sha256("you are in" + res.rows[0].id + SALT);
                // check to see if err is null

                // they have successfully registered, log them in
                response.cookie('loggedin', hashedLogin);
                response.cookie('User', res.rows[0].id);
                response.redirect('/meds/' + res.rows[0].id);
            }

        }
    });
});



app.get('/register', (request, response) => {
    response.render('register');
});

app.get('/', (request, response) => {
    response.render('home');
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);