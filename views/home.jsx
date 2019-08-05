var React = require("react");
const Layout = require('./layout.jsx');

class Home extends React.Component {
    render() {
        return (
            <Layout>
                <h1>MedTracker</h1>
                <div id="logindiv">
                    <form method="POST" action="/users/logincheck">
                        <h2>Login to your account</h2>
                        <div class="form-row align-items-center justify-content-center">
                            <div class="col-2">
                                <label>Name:</label>
                            </div>
                            <div class="col-2">
                                <input class="form-control"  name="name" />
                            </div>
                        </div>
                        <div class="form-row align-items-center justify-content-center">
                            <div class="col-2">
                                <label>Password:</label>
                            </div>
                            <div class="col-2">
                                <input class="form-control"  type="password" name="password" />
                            </div>
                        </div>
                        <div class="form-row align-items-center justify-content-center">
                            <input id="loginSubmit" type="submit" value="Submit" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
                <div class="form-row align-items-center justify-content-center">
                    <a href="/register"><button class="btn btn-outline-primary">Register for an account</button></a>
                </div>

            </Layout>
        );
    }
}

module.exports = Home;