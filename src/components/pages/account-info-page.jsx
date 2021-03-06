import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Input, Modal, Button } from "react-materialize";

import { RightButtonPanel } from "../utilities";
import ChangePasswordForm from "../forms/change-password";
import EditAccountForm from "../forms/edit-account";

class AccountInfoPage extends React.Component {
  // <RightButtonPanel><Button className="teal darken-3" waves="light">Add Admin</Button><Button className="teal darken-3" waves="light">Step Down</Button></RightButtonPanel>
  render() {
    const { user, admins } = this.props;
    if (!user.content || !admins.content) return <div></div>;
    const { name, email, university } = user.content;
    return (
      <Row className="container">
        <Col s={12}>
          <h2 className="teal-text text-darken-4" style={{marginTop: "36px"}}>Account
            <Modal header="Edit Account" trigger={<a className="teal-text text-darken-4 right"><i className="fa fa-pencil" aria-hidden="true"></i></a>}>
              <EditAccountForm />
            </Modal>
            </h2>
          <ul>
            <li>Name: {name}</li>
            <li>Email: {email}</li>
            <li>University: {university}</li>
            <li><Modal header="Change Password" trigger={<a className="teal-text text-darken-3 underline-hover">Change password</a>}>
              <ChangePasswordForm />
            </Modal></li>
          </ul>

          <h2 className="teal-text text-darken-4">Admins</h2>
          <p>If you have any problems, please contact the USMCA admins at director@usmath.org.</p>
        </Col>
      </Row>
    );
  }
}

AccountInfoPage.propTypes = {
  user: PropTypes.object.isRequired,
  admins: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user,
  admins: state.users.admins
});

export default connect(mapStateToProps)(AccountInfoPage);
