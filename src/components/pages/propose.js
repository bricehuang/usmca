import * as React from "react";
import { Row, Col, Input, Button } from "react-materialize";
import { getProposal, fetchCompetition } from "../../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import ProposeForm from "../forms/propose";

class ProposePage extends React.Component {
  componentWillMount() {
    const { match, getProposal, fetchCompetition } = this.props;
    if (match.params && match.params.problem_id) {
      getProposal(match.params.problem_id);
    } else if (match.params && match.params.competition_id) {
      fetchCompetition(match.params.competition_id);
    }
  }

  render() {
    const { match, proposal, competition } = this.props,
          edit = !!(match.params && match.params.problem_id),
          initialized = !! (edit && proposal);
    let returnButton;
    if (edit) {
      const { content, message, requestStatus } = proposal;
      if (content) {
        returnButton = (
          <div>
            <Link to={ `/view-problem/${content._id}` }
                  className="waves-effect waves-light btn teal darken-3">
              Return to Problem
            </Link>
            <div style={{height: "5px"}}></div>
            <Link to={ `/view-competition/${content.competition._id}` }
                  className="waves-effect waves-light btn teal darken-3">
              Return to { content.competition.short_name } Home
            </Link>
          </div>
        )
      } else {
        returnButton = <div></div>
      }
    } else {
      const { content, message, requestStatus } = competition;
      if (content) {
        returnButton = (
          <Link to={ `/view-competition/${content._id}` }
                className="waves-effect waves-light btn teal darken-3">
            Return to { content.short_name } Home
          </Link>
        )
      } else {
        returnButton = <div></div>
      }
    }
    return (
      <Row className="container">
        <div style={{marginTop: "36px"}}>
          { returnButton }
          <h2 className="teal-text text-darken-4">
            { edit ? "Edit a Problem" : 'Propose a Problem' }
          </h2>
          <ProposeForm
            edit={ edit }
            proposal={ initialized ? proposal.content : null }
            competition_id = { competition.content ? competition.content._id : null }/>
        </div>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
        proposal: state.problems.proposal,
        competition: state.competitions.competition,
      }),
      mapDispatchToProps = dispatch => ({
        getProposal: problem_id => {
          getProposal(problem_id)(dispatch);
        },
        fetchCompetition: competition_id => {
          fetchCompetition(competition_id)(dispatch);
        },
      });

export default connect(mapStateToProps, mapDispatchToProps)(ProposePage);
