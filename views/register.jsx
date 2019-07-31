var React = require("react");
const Layout = require('./layout.jsx');

class Register extends React.Component {
    render() {

        return (
            <Layout>
                <form method="POST" action="/users">
                    <h1>Register for a new account!</h1>
                    <p>Name: <input name="name" /></p>
                    <p>Password: <input type="password" name="password" /></p>
                    <input type="submit" value="submit" />
                </form>
            </Layout>
        );
    }
}

module.exports = Register;