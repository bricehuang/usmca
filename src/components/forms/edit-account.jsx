import * as React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'react-materialize';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Error from "../error";
import Spinner from "../spinner";
import { editAccount } from "../../actions";
import { EDIT_ACCOUNT, requestStatuses } from "../../actions/types";
import { RightButtonPanel } from "../utilities";

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const NameField = ({ input, meta, ...rest }) => (
        <Input placeholder="Name" s={12} { ...input } { ...rest } />
      ),
      UniversityField = ({ input, meta, ...rest }) => (
        <Input placeholder="University" s={12} { ...input } { ...rest } />
      );

class EditAccountForm extends React.Component {
  onSubmit = ({ name, university }) => {
    const { errorHandler, editAccount } = this.props;
    if (!name || !university) {
      errorHandler("Please fill out all fields.");
    } else {
      editAccount({ name, university });
    }
  };

  render() {
    const {
      handleSubmit,
      data: { content, requestStatus, message },
    } = this.props;
    return (requestStatus === SUCCESS) ? (
      <div>
        <p>Successfully edited account!</p>
      </div>
    ) : (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row className="placeholder-form">
          <div>
            <Field name="name" component={ NameField } />
          </div>
          <div>
            <Field name="university" component={ UniversityField } />
          </div>
          <Col s={12}>
            <Button waves="light" className="teal darken-4 right">
              Submit
            </Button>
          </Col>
        </Row>
        <Error s={12} error={ requestStatus === ERROR } message={ message } />
        {
          (requestStatus === PENDING) && <Spinner />
        }
      </form>
    );
  }
}

EditAccountForm.propTypes = {
  data: PropTypes.object.isRequired,
  editAccount: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  data: state.auth.editAccount,
});

const mapDispatchToProps = dispatch => ({
  errorHandler: message => {
    dispatch({ type: EDIT_ACCOUNT, payload: { requestStatus: ERROR, message } });
  },
  editAccount: ({ name, university }) => {
    editAccount({ name, university })(dispatch);
  }
});

export default reduxForm({
  /* unique name for form */
  form: 'edit-account'
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditAccountForm)
);
