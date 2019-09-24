var React = require("react");
const Layout = require('./layout.jsx');

class Deletemed extends React.Component {
  render() {
    console.log("in delete form");
    console.log(this.props.med);

    let timestamp = this.props.med.start_time;


    let url = `/meds/single/${this.props.med.id}?_method=DELETE`;

    return (

        <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
            <h1>Confirm deletion of this medication and its logs!</h1>
            <form method="POST" action={url}>
                <input type="hidden" name="id" value={this.props.med.id} />
                <input type="hidden" name="user_id" value={this.props.med.user_id} />
                <p><strong>Medication Name:</strong> {this.props.med.name} <br /></p>
                <p><strong>Dosage:</strong> {this.props.med.dose} {this.props.med.dose_category} <br />
                </p>
                <p><strong>Duration between each dose:</strong> {this.props.med.time_interval} hours<br /></p>
                <p>Time for next dose at the current duration ({this.props.med.time_interval} hours): {timestamp.toString()}<br />
                </p>
                <p>--</p>
                <input class="btn btn-danger" type="submit" value="Submit" /> <a href={`/meds/${this.props.med.user_id}`}><input class="btn btn-secondary" type="button" value="Cancel" /></a>
            </form>
        </Layout>
    );
  }
}

module.exports = Deletemed;