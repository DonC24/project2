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



//delete a medication
app.get('/meds/single/delete/:id', (request, response) => {
    var inputId = parseInt(request.params.id);
    let queryString = "SELECT * FROM medication WHERE id = ($1)";
    var idVal = [inputId];
    pool.query(queryString, idVal, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            const data = {
                med : res.rows[0]
            };
            //console.log(data);
            response.render('delete', data);
        }
    });
});

app.delete('/meds/single/:id', (request, response) => {
    console.log("inside app delete");
    var newMed = request.body;
    var inputId = parseInt(request.params.id);
    let queryString = "DELETE FROM medication WHERE id = ($1)";
    var idVal = [inputId];
    console.log(idVal);
    pool.query(queryString, idVal, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            //response.send('Yay! deleted!');
            response.redirect(`/meds/${newMed.user_id}`);
        }
    });
});


//get edit page of single medication
app.get('/meds/single/edit/:id', (request, response) => {
    var inputId = parseInt(request.params.id);
    let queryString = "SELECT * FROM medication WHERE id = ($1)";
    var idVal = [inputId];
    pool.query(queryString, idVal, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            const data = {
                med : res.rows[0]
            };
            console.log(data);
            response.render('edit', data);
        }
    });
});

//Updates the SQL with new info for single medication
app.put('/meds/single/edit/:id', (request, response) => {
    var inputId = parseInt(request.params.id);
    console.log(request.body);
    var newMed = request.body;

    let now = moment();
    let timeNextPill = newMed.start_time;

    if (timeNextPill < now){
        timeNextPill = moment(timeNextPill).add(newMed.time_interval, 'h').local().format();
    } else {
        console.log("no need to update time");
    }

    // let newStart = moment(res.rows[0].start_time).add(res.rows[0].time_interval, 'h').local().format();
    // console.log("new start" + newStart);

    let queryString = "UPDATE medication SET name=($1), dose=($2), dose_category=($3), time_interval=($4), start_time=($5) WHERE id = ($6)";
    let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, timeNextPill, newMed.user_id];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            response.redirect(`/meds/${newMed.user_id}`);
        }
    });
});

//POST new medication
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

    const queryString = "SELECT medication.id,medication.name,medication.dose,medication.dose_category,medication.start_time,medication.time_interval,medication.user_id,users.name AS user_name FROM medication INNER JOIN users ON (users.id = medication.user_id) WHERE medication.user_id = $1 ORDER BY medication.start_time ASC";

    const values = [parseInt(request.params.id)];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);

        } else {
            //console.log(res.rows);


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
                console.log(res.rows);
                const data = {
                    medData : res.rows,
                    minTime : minMili
                }
                response.render('userpage', data);
            }

        }
    });
});

//PUT request from timeout
app.put('/meds/:id', (request, response) => {

    console.log("inside put req for confirmation");
    var inputId = parseInt(request.params.id);
    console.log(inputId);

    let queryString = "SELECT * FROM medication WHERE user_id = ($1)";
    var idVal = [inputId];
    pool.query(queryString, idVal, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            let med = res.rows;
            console.log(med);

            let now = moment();
            console.log("now: " + now);

            for(let i = 0; i<med.length; i++){
                if (moment(now).isAfter(med[i].start_time)){
                    med[i].start_time = moment(med[i].start_time).add(med[i].time_interval, 'h').local().format();
                } else {
                    console.log("do nothing");
                }
            }
            console.log(med);

            /*let queryString = "UPDATE medication SET name=($1), dose=($2), dose_category=($3), time_interval=($4), start_time=($5) WHERE id = ($6)";
            let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, timeNextPill, newMed.user_id];

            pool.query(queryString, values, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    response.redirect(`/meds/${newMed.user_id}`);
                }
            }*/
        }
    });
});



/*    console.log(request.body);
    var newMed = request.body;

    let now = moment();
    let timeNextPill = newMed.start_time;

    if (timeNextPill < now){
        timeNextPill = moment(timeNextPill).add(newMed.time_interval, 'h').local().format();
    } else {
        console.log("no need to update time");
    }

    // let newStart = moment(res.rows[0].start_time).add(res.rows[0].time_interval, 'h').local().format();
    // console.log("new start" + newStart);

    let queryString = "UPDATE medication SET name=($1), dose=($2), dose_category=($3), time_interval=($4), start_time=($5) WHERE id = ($6)";
    let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, timeNextPill, newMed.user_id];

    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            response.redirect(`/meds/${newMed.user_id}`);
        }
    });
});*/


//POST register user
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

app.get('/logout', (request, response) => {
    response.clearCookie('loggedin');
    response.clearCookie('User');
    response.redirect('/');
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