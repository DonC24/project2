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
                        <table>
                            <tr><td>Name:</td> <td><input name="name" /></td></tr>
                            <tr><td>Password:</td> <td><input type="password" name="password" /></td></tr>
                        </table>
                        <input id="loginSubmit" type="submit" value="Submit" class="btn btn-primary" />
                    </form>
                </div>
                <a href="/register"><button class="btn btn-outline-primary">Register for an account</button></a>

            </Layout>
        );
    }
}

module.exports = Home;