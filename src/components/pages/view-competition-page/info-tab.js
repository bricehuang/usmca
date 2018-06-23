import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import auth from "../../../auth";
import { permissionsDisplay } from "../../../../constants";

import {
  DIRECTOR, PENDING_DIRECTOR, CZAR, SECURE, MEMBER, NONMEMBER, competitionMembership, makeURL
} from "../../utilities";

const competitionInfoDisplay = (competition) => {
  const membership = competitionMembership(competition, auth.userId());
  return (
    <div className="round-container">
      <ul>
        <li><h3>Competition Info<a className="right black-text"><i className="fa fa-pencil" aria-hidden="true" /></a></h3></li>
        <li>Name: { competition.name }</li>
        <li>Short name: { competition.short_name }</li>
        <li>Website: { (competition.website) ? <a href={ makeURL(competition.website) } className="teal-text text-darken-3 underline-hover">{ competition.website }</a> : "N/A"}</li>
        <li><h3>Membership Info</h3></li>
        <li>You are a: <span className="bold-text">{ permissionsDisplay[membership] }</span></li>
        { membership === DIRECTOR &&  <li><a className="teal-text text-darken-3 underline-hover">Step down as director</a></li> }
        <li><a className="teal-text text-darken-3 underline-hover">Leave competition</a></li>
        {
          (membership === DIRECTOR || membership === CZAR || membership === SECURE) && (
            <div>
              <li><h3>Database</h3></li>
              <li><Link to={ `/view-database/${competition._id}` } className="waves-effect waves-light btn teal darken-3">View database</Link></li>
            </div>
          )
        }
      </ul>
    </div>
  )
}

const InfoTab = ({competition}) => {
  const { content, message, requestStatus } = competition;
  if (content) {
    return competitionInfoDisplay(content);
  } else {
    // TODO: spinner
    return <div></div>
  }
}

InfoTab.propTypes = {
  competition: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  competition: state.competitions.competition
});

export default connect(mapStateToProps)(InfoTab);
