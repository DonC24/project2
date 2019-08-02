var React = require("react");
const Layout = require('./layout.jsx');

class Onemed extends React.Component {
  render() {
    console.log('creating an med data li?');

    return (
        <div class="output">
            {/*User Id: {this.props.medData.user_id}<br />*/}
            <p><strong>Name:</strong> {this.props.medData.name}<br />
            <strong>Dose:</strong> {this.props.medData.dose} {this.props.medData.dose_category}<br />
            <strong>Next dose in:</strong> {this.props.medData.nextTime} ({this.props.medData.start_time.toString()})<br /></p>
            <p><a href={`/meds/single/edit/${this.props.medData.id}`}><button class="btn btn-primary">Edit this entry</button></a></p>
            <p><a href = {`/meds/single/delete/${this.props.medData.id}`}><button class="btn btn-warning">Delete this entry</button></a></p>
        </div>
    );
  }
}

class Userpage extends React.Component {
    render() {

        console.log("inside List creation?");
        console.log(this.props.medData);

        let itemElements = this.props.medData.map((med) => {
            return <Onemed medData={med}> </Onemed>
        });

        return (
            <Layout>
            <h1>{this.props.medData[0].user_name}'s MedTracker page</h1>
                <h3 id="nextMedHead">Your next medication is {this.props.medData[0].name}</h3>
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