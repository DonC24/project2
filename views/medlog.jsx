var React = require("react");
const Layout = require('./layout.jsx');

class Onelog extends React.Component {
  render() {
    console.log('creating a log?');

    return (
        <div class="output">
            {/*User Id: {this.props.medData.user_id}<br />*/}
            <p><strong>Medication name:</strong> {this.props.logData.name}<br />
            <strong>Time taken:</strong> {this.props.logData.time_taken.toString()}</p>
        </div>
    );
  }
}

class Medlog extends React.Component {
    render() {

        console.log(this.props.logData);

        let itemElements = this.props.logData.map((log) => {
            return <Onelog logData={log}> </Onelog>
        });

        let url = "/meds/" + this.props.logData[0].user_id;

        return (
            <Layout>
                <h1>Medication Log</h1>

                <div>
                    {itemElements}
                </div>
                <a href={url}>Go back</a>
            </Layout>
        );
    }
}

module.exports = Medlog;