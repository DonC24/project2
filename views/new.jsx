var React = require("react");
const Layout = require('./layout.jsx');

class New extends React.Component {
  render() {
    return (
        <Layout>
            <h1>Create a new schedule!</h1>
            <form method="POST" action="/meds">
                {/*<p>User Id: <input type="number" name="user_id" value={this.props.medData.user_id} hidden /></p>*/}
                <p>Medication Name: <input type="text" name="name"/></p>
                <p>Dosage: <input type="number" name="dose"/>
                    <select name="dose_category">
                        <option value="ml">ml</option>
                        <option value="pills">pills</option>
                        <option value="drops">drops</option>
                    </select>
                </p>
                <p>Duration between each dose: <input type="number" name="time_interval" /> hours</p>
                <p>Time you will start taking your medication: <input type="datetime-local" name="start_time" /></p>
                <p>--</p>
                <input type="submit" value="Submit" />
            </form>
        </Layout>
    );
  }
}

module.exports = New;