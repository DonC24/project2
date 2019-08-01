var React = require("react");
const Layout = require('./layout.jsx');

class Deletemed extends React.Component {
  render() {
    console.log("in delete form");
    console.log(this.props.med);

    let timestamp = this.props.med.start_time;


    let url = `/meds/single/${this.props.med.id}?_method=DELETE`;

    return (

        <Layout>
            <h1>Confirm deletion of this medication!</h1>
            <form method="POST" action={url}>
                <input type="hidden" name="id" value={this.props.med.id} />
                <input type="hidden" name="user_id" value={this.props.med.user_id} />
                <p>Medication Name: {this.props.med.name} <br /></p>
                <p>Dosage: {this.props.med.dose} {this.props.med.dose_category} <br />
                </p>
                <p>Duration between each dose: {this.props.med.time_interval} hours<br /></p>
                <p>Time for next dose at the current duration ({this.props.med.time_interval} hours): {timestamp.toString()}<br />
                </p>
                <p>--</p>
                <input type="submit" value="Submit" /> <a href={`/meds/${this.props.med.user_id}`}><input type="button" value="Cancel" /></a>
            </form>
        </Layout>
    );
  }
}

module.exports = Deletemed;