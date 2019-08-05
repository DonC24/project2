var React = require("react");
const Layout = require('./layout.jsx');

class Register extends React.Component {
    render() {

        return (
            <Layout>
                <div>
                    <form method="POST" action="/users">
                        <h1>Register for a new account!</h1>
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
                                <input class="form-control" name="password" />
                            </div>
                        </div>
                        <div class="form-row align-items-center justify-content-center">
                                <input id="loginSubmit" type="submit" value="Submit" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </Layout>
        );
    }
}

module.exports = Register;