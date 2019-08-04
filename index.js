console.log("starting up!!");

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser')

const moment = require('moment');

var format = require('pg-format');

let sha256 = require('js-sha256');
const SALT = "ALL YOUR BASE ARE BELONG TO US";

// Initialise postgres client

//require the url library
//this comes with node, so no need to yarn add
const url = require('url');

//check to see if we have this heroku environment variable
if( process.env.DATABASE_URL ){

  //we need to take apart the url so we can set the appropriate configs

  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

}else{

  //otherwise we are on the local network
  var configs = {
        user: 'donc',
        host: '127.0.0.1',
        database: 'medtrack_db',
        port: 5432,
        password: 'password'
  };
}

//this is the same
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


//PUT request from timeout/confirmation button
app.put('/meds/updates/:id', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        console.log(request.params);
        console.log("inside put req for confirmation");
        var inputId = parseInt(request.params.id);
        console.log(inputId);

        //get all medication from user ordered by start time
        let queryString = "SELECT * FROM medication WHERE user_id = ($1) ORDER BY start_time ASC";
        var idVal = [inputId];
        pool.query(queryString, idVal, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                let med = res.rows;
                console.log(med);

                let now = moment();
                console.log("now: " + now);

                //check if time now is after start time. if it is, add interval to previous start time
                for(let i = 0; i<med.length; i++){
                    if (moment(now).isAfter(med[i].start_time)){
                        med[i].start_time = moment(med[i].start_time).add(med[i].time_interval, 'h').local().format();
                    } else {
                        console.log("do nothing");
                    }
                }
                console.log(med);

                //update start time in medication list to new start time.
                for(let j = 0;  j < med.length; j++){
                    let queryString2 = "UPDATE medication SET start_time=($1) WHERE id = ($2)";
                    let values2 = [med[j].start_time, med[j].id];

                    pool.query(queryString2, values2, (err, res) => {
                        if (err) {
                            console.log("query error", err.message);
                        } else{
                            //insert into confirmation table that medication was taken
                            let timestamp = moment();
                            const queryString3 = "INSERT INTO confirmation (medication_id, time_taken) VALUES ($1, $2) RETURNING *"
                            const values3 = [med[j].id, timestamp];

                            pool.query(queryString3, values3, (err, res) => {
                                if (err) {
                                    console.log("query error", err.message);
                                } else {
                                    console.log("confirmation inserted");
                                }
                            })
                        }
                    })
                }

                setTimeout(function(){response.redirect(`/meds/${med[0].user_id}`)}, 2000);
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }
});


//delete a medication
app.get('/meds/single/delete/:id', (request, response) => {

    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];
        var inputId = parseInt(request.params.id);
        let queryString = "SELECT * FROM medication WHERE id = ($1)";
        var idVal = [inputId];
        pool.query(queryString, idVal, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                //format start time to local time to display on user page
                for( let i= 0; i< res.rows.length; i++) {
                    let dateTimeNext = res.rows[i].start_time;
                    res.rows[i]['start_time'] = moment(dateTimeNext).format("dddd, DD MMM YYYY, h:mm a");
                }

                const data = {
                    med : res.rows[0],
                    cookieLogin: cookieLogin,
                    cookieUserId: cookieUserId
                };
                //console.log(data);
                response.render('delete', data);
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }

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
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];
        var inputId = parseInt(request.params.id);
        let queryString = "SELECT * FROM medication WHERE id = ($1)";
        var idVal = [inputId];
        pool.query(queryString, idVal, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {

                //format start time to local time to display on user page
                for( let i= 0; i< res.rows.length; i++) {
                    let dateTimeNext = res.rows[i].start_time;
                    res.rows[i]['start_time'] = moment(dateTimeNext).format("dddd, DD MMM YYYY, h:mm a");
                }

                const data = {
                    med : res.rows[0],
                    cookieLogin: cookieLogin,
                    cookieUserId: cookieUserId
                };
                console.log(data);
                response.render('edit', data);
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }
});

//Updates the SQL with new info for single medication
app.put('/meds/single/edit/:id', (request, response) => {
    console.log("inside single edit put");
    var inputId = parseInt(request.params.id);
    console.log(request.body);
    var newMed = request.body;

    let now = moment();
    let timeNextPill = moment(newMed.start_time).format()
    now = Date.parse(now)
    timeNextPill = Date.parse(timeNextPill);

    if (timeNextPill < now){
        timeNextPill = moment(timeNextPill).add(newMed.time_interval, 'h').local().format();
        console.log("timeNextPill " + timeNextPill);
    } else {
        console.log("no need to update time");
    }

    let queryString = "UPDATE medication SET name=($1), dose=($2), dose_category=($3), time_interval=($4), start_time=($5) WHERE id = ($6)";
    let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, timeNextPill, newMed.id];

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

    let now = moment();
    console.log(now);
    let timeNextPill = moment(newMed.start_time).format()
    //need to use Date.parse before comparison otherwise date time cannot be compared
    now = Date.parse(now)
    timeNextPill = Date.parse(timeNextPill);
    console.log(timeNextPill < now);
    if (timeNextPill < now){
        timeNextPill = moment(timeNextPill).add(newMed.time_interval, 'h').local().format();
        console.log("timeNextPill " + timeNextPill);
    } else {
        console.log("no need to update time");
    }

    const queryString = 'INSERT INTO medication (name, dose, dose_category, time_interval, start_time, user_id) VALUES ($1, $2, $3, $4, $5, $6)';
    let values = [newMed.name, newMed.dose, newMed.dose_category, newMed.time_interval, newMed.start_time, userId];
    pool.query(queryString, values, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(res);

            //response.send("New medication has been created!");
            response.redirect(`/meds/${userId}`);
        }

    });
});

//get log of medications taken
app.get('/meds/:id/log', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];

        console.log(response.body);

        const queryString = "SELECT medication.id AS med_id,medication.name, medication.user_id, confirmation.id, confirmation.medication_id, confirmation.time_taken FROM medication INNER JOIN confirmation ON (medication.id = confirmation.medication_id) WHERE medication.user_id = $1 ORDER BY confirmation.time_taken DESC";

        const values = [parseInt(request.params.id)];

        pool.query(queryString, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);

            } else {
                //console.log(res.rows);

                console.log(res.rows);
                const data = {
                    logData : res.rows,
                    cookieLogin: cookieLogin,
                    cookieUserId: cookieUserId
                }
                response.render('medlog', data);
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }
});

//render form to add new medication
app.get('/meds/new', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let cookieUserId = request.cookies['User'];
        const data = {
            cookieLogin: cookieLogin,
            cookieUserId: cookieUserId
        }
        response.render('new', data);
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }
});

//page for all medication of user
app.get('/meds/:id', (request, response) => {
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
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
                    //find out how long to next pill (eg: in 2 hours)
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

                    //format start time to local time to display on user page
                    for( let i= 0; i< res.rows.length; i++) {
                        let dateTimeNext = res.rows[i].start_time;
                        res.rows[i]['start_time'] = moment(dateTimeNext).format("dddd, DD MMM YYYY, h:mm a");
                    }

                    //find the number of milliseconds to the next pill
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
                        minTime : minMili,
                        cookieLogin: cookieLogin
                    }
                    response.render('userpage', data);
                }
            }
        });
    } else {
        response.clearCookie('User');
        response.clearCookie('loggedin');
        response.redirect('/');
    }
});


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
    if (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]){
        let cookieLogin = (sha256("you are in" + request.cookies["User"] + SALT) === request.cookies["loggedin"]) ? true : false;
        let userId = request.cookies['User'];
        response.redirect(`/meds/${userId}`);
    } else {
        response.render('home');
    }
});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

let onClose = function(){

  console.log("closing");

  server.close(() => {

    console.log('Process terminated');

    pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);