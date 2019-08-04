var React = require("react");
const Layout = require('./layout.jsx');

class New extends React.Component {
  render() {
    return (
        <Layout cookieLogin={this.props.cookieLogin} cookieUserId={this.props.cookieUserId}>
            <h1>Create a new schedule!</h1>
            <form method="POST" action="/meds">
                <table>
                <tr>
                    <td><strong>Medication Name:</strong></td> <td><input type="text" name="name"/></td>
                </tr>
                <tr>
                    <td><strong>Dosage:</strong></td> <td><input type="number" min="0" name="dose"/>
                        <select name="dose_category">
                            <option value="ml">ml</option>
                            <option value="pills">pills</option>
                            <option value="drops">drops</option>
                        </select>
                    </td>
                </tr>
                <tr>
                <td><strong>Duration between each dose:</strong></td> <td><input type="number" name="time_interval" /> hours</td>
                </tr>
                <tr>
                <td><strong>Time you will start taking your medication:</strong></td> <td><input type="datetime-local" name="start_time" /></td>
                </tr>
                </table>
                <p>--</p>
                <input class="btn btn-primary" type="submit" value="Submit" />
            </form>
        </Layout>
    );
  }
}

module.exports = New;