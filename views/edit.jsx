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

        <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
            <h1>Edit this medication!</h1>
            <form method="POST" action={url}>
                <div class="form-group">
                    <input type="hidden" name="id" value={this.props.med.id} />
                    <input type="hidden" name="user_id" value={this.props.med.user_id} />
                    <p><strong>Medication Name:</strong> {this.props.med.name} </p>
                     <input class="form-control" type="text" name="name" value={this.props.med.name}/>
                </div>
                <div class="form-group">
                    <p><strong>Dosage:</strong> {this.props.med.dose} {this.props.med.dose_category}</p>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                     {/*<strong>New dosage:</strong> */}<input class="form-control" type="number" min="0" name="dose" value={this.props.med.dose} />
                     </div>
                     <div class="form-group col-md-6">
                        <select class="form-control" name="dose_category" value={this.props.med.dose_category}>
                            <option value="ml">ml</option>
                            <option value="pills">pills</option>
                            <option value="drops">drops</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <p><strong>Duration between each dose:</strong> {this.props.med.time_interval} hours</p>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-9">
                        <input class="form-control" type="number" min="0" name="time_interval" value={this.props.med.time_interval} />
                    </div>
                    <div class="form-group col-md-3">
                        <p align="left">hours</p>
                    </div>
                </div>
                <div class="form-group">
                    <p><strong>Time for next dose at the current duration</strong> <em>({this.props.med.time_interval} hours)</em>: {timestamp.toString()}</p>
                    Update the time that you will start taking your medication? <input class="form-control" type="datetime-local" name="start_time" required />
                </div>
                    <p>--</p>
                <div class="form-group">
                    <input class="btn btn-primary" type="submit" value="Submit Edits" />
                </div>

            </form>
        </Layout>
    );
  }
}

module.exports = Editmed;