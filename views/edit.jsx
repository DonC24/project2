var React = require("react");
const Layout = require('./layout.jsx');

class Editmed extends React.Component {
  render() {
    console.log("in edit form");
    console.log(this.props.med.name);

    let timestamp = this.props.med.start_time;
/*    let date = timestamp.getDate();
    let time = timestamp.*/


    let url = `/meds/single/edit/${this.props.med.id}?_method=PUT`;

    return (

        <Layout>
            <h1>Edit this medication!</h1>
            <form method="POST" action={url}>
                <input type="hidden" name="id" value={this.props.med.id} />
                <input type="hidden" name="user_id" value={this.props.med.user_id} />
                <p><strong>Medication Name:</strong> {this.props.med.name} <br />
                 <input type="text" name="name" value={this.props.med.name}/></p>
                <p><strong>Dosage:</strong> {this.props.med.dose} {this.props.med.dose_category} <br />
                 <strong>New dosage:</strong> <input type="number" min="0" name="dose" value={this.props.med.dose} />
                    <select name="dose_category" value={this.props.med.dose_category}>
                        <option value="ml">ml</option>
                        <option value="pills">pills</option>
                        <option value="drops">drops</option>
                    </select>
                </p>
                <p><strong>Duration between each dose:</strong> {this.props.med.time_interval} hours<br />
                <input type="number" name="time_interval" value={this.props.med.time_interval} /> hours</p>
                <p>Time for next dose at the current duration ({this.props.med.time_interval} hours): {timestamp.toString()}<br />
                Update the time that you will start taking your medication? <input type="datetime-local" name="start_time" required />
                </p>
                <p>--</p>
                <input class="btn btn-primary" type="submit" value="Submit Edits" />
            </form>
        </Layout>
    );
  }
}

module.exports = Editmed;