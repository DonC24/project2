var React = require("react");
const Layout = require('./layout.jsx');

class Home extends React.Component {
    render() {
        return (
            <Layout>
                <h1>Welcome!</h1>
                <p>Hello world!</p>
                <div id="logindiv">
                    <form method="POST" action="/users/logincheck">
                        <h1>Login to your account</h1>
                        <p>Name: <input name="name" /></p>
                        <p>Password: <input type="password" name="password" /></p>
                        <input type="submit" value="submit" />
                    </form>
                </div>
                <a href="/register">Register for an account</a>

            </Layout>
        );
    }
}

module.exports = Home;