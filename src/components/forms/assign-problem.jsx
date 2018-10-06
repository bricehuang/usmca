import * as React from "react";
import PropTypes from "prop-types";
import { Col, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import _ from "lodash";

import Input from "../react-materialize-custom/ControlledInput";
import { RightButtonPanel } from "../utilities";
import { permissionsEnum } from "../../../constants";
import { addTestProb } from "../../actions";
import {
  USER_CHANGE_PERM,
  requestStatuses,
  requestPayloads
} from "../../actions/types";

const { SUCCESS, IDLE, PENDING, ERROR } = requestStatuses;

class AssignProblem extends React.Component {
  onSubmit = ({ test }) => {
    const { prob, addTestProb } = this.props;
    if (test == "_unassigned") {
      // do nothing
    } else {
      addTestProb(test, prob);
      console.log("Assigned test to ");
      console.log(test);
    }
  }

  testLocationField = ({ input, meta, ...rest }) => {
    return (
      <div>
        <Input s={12} type="select" defaultValue={ "_unassigned" } { ...input } { ...rest }>
          <option value="_unassigned">Select a Test</option>
          {
            this.props.tests.map((test, idx) => (
              <option value={ test._id } key={ idx }>{ test.contest } / { test.test }</option>
            ))
          }
        </Input>
      </div>
    );
  }

  render() {
    const {handleSubmit} = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="test" component={ this.testLocationField } />
        </div>
        <RightButtonPanel>
          <Button type="submit" onClick={() => window.location.reload()} className="teal darken-2">Apply</Button>
        </RightButtonPanel>
      </form>
    )
  }
}

const mapStateToProps = state => ({
        // changePermData: state.users.changePermission
      }),
      mapDispatchToProps = dispatch => ({
        addTestProb: (test_id, problem_id) => {
          addTestProb(test_id, problem_id)(dispatch);
        },
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'move-problem' })(AssignProblem)
);
