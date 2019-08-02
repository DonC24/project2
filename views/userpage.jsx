var React = require("react");
const Layout = require('./layout.jsx');

class Onemed extends React.Component {
  render() {
    console.log('creating an med data li?');

    return (
        <div class="output">
            {/*User Id: {this.props.medData.user_id}<br />*/}
            Name: {this.props.medData.name}<br />
            Dose: {this.props.medData.dose} {this.props.medData.dose_category}<br />
            Next dose in: {this.props.medData.nextTime} ({this.props.medData.start_time.toString()})<br />
            <a href={`/meds/single/edit/${this.props.medData.id}`}>Edit this entry</a><br />
            <a href = {`/meds/single/delete/${this.props.medData.id}`}>Delete this entry</a>
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
                <a href="/meds/new">Add medication</a>

             <script dangerouslySetInnerHTML={ {__html:
                    `var myVar = '${this.props.minTime}'; var userId = '${this.props.medData[0].user_id}';`
                  }}/>
            <script src="/scripts.js"></script>
            </Layout>
        );
    }
}

module.exports = Userpage;