var React = require("react");
const Layout = require('./layout.jsx');

class New extends React.Component {
  render() {
    return (
        <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId} anylogdata={this.props.anylogdata}>
            <h1>Create a new schedule!</h1>
            <div class="container formwrap align-items-center justify-content-center col-6">
                <div class="row">
                    <div class="col">
                        <form method="POST" action="/meds">
                            <div class="form-group">
                                <label><strong>Medication Name:</strong></label>
                                 <input class="form-control" type="text" name="name"/>
                            </div>
                            <div class="form-group">
                                <div class="form-row align-items-center justify-content-center">
                                    <label><strong>Dosage:</strong></label>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                    <input class="form-control" type="number" min="0" name="dose" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <select class="form-control" name="dose_category">
                                            <option value="ml">ml</option>
                                            <option value="pills">pills</option>
                                            <option value="drops">drops</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label><strong>Duration between each dose:</strong></label>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-9">
                                    <input class="form-control" type="number" min="0" name="time_interval" />
                                </div>
                                <div class="form-group col-md-3">
                                    <p align="left">hours</p>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>
                                <strong>Time that you will start taking your medication:</strong></label> <input class="form-control" type="datetime-local" name="start_time" required />
                            </div>
                                <p>--</p>
                            <div class="form-group">
                                <input class="btn btn-primary" type="submit" value="Submit Edits" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
  }
}

module.exports = New;