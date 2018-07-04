import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Modal } from "react-materialize";
import moment from "moment";

import * as Forms from "../../forms";
import CreateContestForm from "../../forms/create-contest";
import auth from "../../../auth";

import {
  DIRECTOR, PENDING_DIRECTOR, CZAR, SECURE, MEMBER, NONMEMBER, competitionMembership, makeURL
} from "../../utilities";

const contestsDisplay = (competition) => {
  const membership = competitionMembership(competition, auth.userId());
  const contestView = (contest, idx) => (
    <div style={{borderBottom: "1px solid #cfd8dc"}} key={idx}>
      <h3>
        <Link to={ `/view-contest/${contest._id}` } className="teal-text text-darken-3 underline-hover">{ contest.name }</Link>
        <a className="right black-text"><i className="fa fa-times" aria-hidden="true" /></a>
        <Modal header="Update Contest" trigger={<a className="right right-space black-text"><i className="fa fa-pencil" aria-hidden="true" /></a>}><Forms.CreateContest contest={ contest } competition_id={ competition._id } /></Modal>
      </h3>
      <ul>
        <li>Date: { contest.date ? moment(contest.date).format('ll') : "N/A" }</li>
        <li>Test solve deadline: { contest.test_solve_deadline ? moment(contest.test_solve_deadline).format('ll') : "N/A" }</li>
        <li>Status: <span className="bold-text">{ contest.active ? "active" : "inactive" }</span></li>
      </ul>
    </div>
  );
  return (
    <div className="round-container">
      { (membership === DIRECTOR || membership === CZAR) &&
        <Modal header="Create Contest" trigger={ <Button className="teal darken-3" waves="light">Create contest</Button> }>
          <CreateContestForm competition_id={ competition._id } />
        </Modal>
      }
      {
        competition.contests.length > 0 ? (
          _.reverse(_.sortBy(competition.contests,
              contest => new Date(contest.date)
            ).map(contestView)
          )
        ) : (
          <p>No contests created yet!</p>
        ) }
    </div>
  )
}

const ContestsTab = ({competition}) => {
  const { content, message, requestStatus } = competition;
  if (content) {
    return contestsDisplay(content);
  } else {
    // TODO: spinner
    return <div></div>
  }
}

ContestsTab.propTypes = {
  competition: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  competition: state.competitions.competition
});

export default connect(mapStateToProps)(ContestsTab);
