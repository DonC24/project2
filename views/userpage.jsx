var React = require("react");
const Layout = require('./layout.jsx');

class Onemed extends React.Component {
  render() {
    console.log('creating a med data div?');

    return (
        <div class="output">
            {/*User Id: {this.props.medData.user_id}<br />*/}
            <p><strong>Name:</strong> {this.props.medData.med_name}<br />
            <strong>Dose:</strong> {this.props.medData.dose} {this.props.medData.dose_category}<br />
            <strong>Next dose in:</strong> {this.props.medData.nextTime} ({this.props.timing})<br /></p>
            <p><a href={`/meds/single/edit/${this.props.medData.id}`}><button class="btn btn-primary">Edit this entry</button></a></p>
            <p><a href = {`/meds/single/delete/${this.props.medData.id}`}><button class="btn btn-warning">Delete this entry</button></a></p>
        </div>
    );
  }
}

class Userpage extends React.Component {
    render() {

        let url = "/meds/updates/" + this.props.cookieUserId + "?_method=PUT";
        console.log("keys length: "+ Object.keys(this.props.medData[0]).length);
        console.log("cookie user id: " + this.props.cookieUserId);

        if(Object.keys(this.props.medData[0]).length === 1) {
            return (
            <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
            <h1>{this.props.medData[0].name}'s MedTracker page</h1>
            {/*<h3 id="nextMedHead">Your next medication is {this.props.medData[0].med_name}<br />*/}
                <form method="POST" action={url}><input class="btn btn-outline-success" id="confirmBtn" type="submit" value="Medication has been taken"/></form>
                <a href="/meds/new"><button class="btn btn-info">Add medication</button></a>

             <script dangerouslySetInnerHTML={ {__html:
                    `var myVar = 'new'; var userId = '${this.props.cookieUserId}';`
                  }}/>
            <script src="/scripts.js"></script>
            </Layout>
            )
        }

        console.log("inside List creation?");

        let itemElements = this.props.medData.map((med) => {
            return <Onemed medData={med} timing={med.start_time.toString()}> </Onemed>
        });



        return (
            <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
            <h1>{this.props.medData[0].name}'s MedTracker page</h1>
                <h3 id="nextMedHead">Your next medication is {this.props.medData[0].med_name}<br />
                <form method="POST" action={url}><input class="btn btn-outline-success" id="confirmBtn" type="submit" value="Medication has been taken"/></form></h3>
                <div>
                    {itemElements}
                </div>
                <a href="/meds/new"><button class="btn btn-info">Add medication</button></a>

             <script dangerouslySetInnerHTML={ {__html:
                    `var myVar = '${this.props.minTime}'; var userId = '${this.props.medData[0].user_id}';`
                  }}/>
            <script src="/scripts.js"></script>
            </Layout>
        );
    }
}

module.exports = Userpage;