var React = require("react");
const Layout = require('./layout.jsx');

class Home extends React.Component {
    render() {
        return (
      <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />


            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"/>

            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="/style.css"></link>
        </head>
        <body>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <a class="navbar-brand" href="/">MedTracker</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                  </li>
                </ul>
              </div>
            </nav>
                <div id="homewrap">
                    <div className="home-left">
                        <h1>MedTracker</h1>
                        <h2>A medication tracker so that you are reminded to take your medication on time</h2>
                    </div>
                    <div id="logindiv" class="col-4">
                        <form class="loginform col-12" method="POST" action="/users/logincheck">
                            <h2>Login to your account</h2>
                            <div class="form-group row col-10">
                                <label for="username" class="col-sm-2 col-form-label">Name: </label>
                                <div class="col-sm-10">
                                    <input id="username" class="form-control"  name="name" />
                                </div>
                            </div>
                            <div class="form-group row col-10">
                                <label for="inputPassword" class="col-sm-2 col-form-label">Password: </label>
                                <div class="col-sm-10">
                                    <input id="inputPassword" class="form-control"  type="password" name="password" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <input id="loginSubmit" type="submit" value="Submit" class="btn btn-primary" />
                            </div>
                            <div class="row">
                        <a href="/register" id="regbtn"><button  class="btn btn-outline-primary">Register for an account</button></a>
                        </div>
                        </form>

                    </div>


                <footer>
                    <p>MedTracker 2019</p>
                </footer>
            </div>
        </body>
      </html>
        );
    }
}

module.exports = Home;