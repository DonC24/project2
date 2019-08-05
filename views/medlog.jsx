var React = require("react");
const Layout = require('./layout.jsx');

class Onelog extends React.Component {
  render() {
    console.log('creating a log?');

    return (
        <div class="output card bg-light mb-3  border-dark mb-3 shadow-sm p-3 mb-5 bg-white rounded" style={{width: '30rem'}}>
            <div class="card-body">
                {/*User Id: {this.props.medData.user_id}<br />*/}
                <p class="card-text"><strong>Medication name:</strong> {this.props.logData.name}<br />
                <strong>Time taken:</strong> {this.props.logData.time_taken.toString()}</p>
            </div>
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
            <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
                <h1>Medication Log</h1>

                <div class="item-container">
                    {itemElements}
                </div>
                <a class="btn btn-primary" href={url}>Go back</a>
            </Layout>
        );
    }
}

module.exports = Medlog;