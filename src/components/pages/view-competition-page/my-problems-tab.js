import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col } from "react-materialize";

import { fetchMyProposalsForCompetition } from "../../../actions";
import { requestStatuses } from "../../../actions/types";
import { ProblemPreview, LoadMore } from "../../utilities";
import Spinner from "../../spinner";

const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

class MyProblemsTab extends React.Component {
  componentWillMount = () => {
    const { content, message, requestStatus } = this.props.competition;
    this.props.fetchMyProposalsForCompetition(content._id);
  }

  render() {
    const { proposals: { content, requestStatus, message } } = this.props;
    if (requestStatus === PENDING) return <Col s={12}><Spinner /></Col>
    return (content && content.length > 0) ? (
      <Col s={12}>
        {
          content.map((proposal, key) => (
            <div style={{borderBottom: "1px solid #cfd8dc", paddingTop: "12px"}} key={key}>
              <ProblemPreview problem={proposal} includeClipboard={false} editable={true} />
            </div>
          ))
        }
      </Col>
    ) : (
      <div>
        <p>
          No proposals made yet! Click <Link to={`/propose/${this.props.competition.content._id}`}> here</Link> to make problem proposals.
        </p>
      </div>
    );
    // <LoadMore />
  }
}

MyProblemsTab.propTypes = {
  proposals: PropTypes.object.isRequired,
  fetchMyProposalsForCompetition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        competition: state.competitions.competition,
        proposals: state.problems.myProposals,
      }),
      mapDispatchToProps = dispatch => ({
        fetchMyProposalsForCompetition: (competition_id) => {
          fetchMyProposalsForCompetition(competition_id)(dispatch);
        }
      });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProblemsTab);
