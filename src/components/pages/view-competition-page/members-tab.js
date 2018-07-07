import * as React from "react";
import { Table, Modal } from "react-materialize";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import auth from "../../../auth";
import { permissionsDisplay } from "../../../../constants";
import ChangePermissions from "../../forms/change-permissions";

import {
  DIRECTOR, PENDING_DIRECTOR, CZAR, SECURE, MEMBER, NONMEMBER, competitionMembership, makeURL
} from "../../utilities";

const PermissionsModal = ({ defaultValue, competition_id, user_id }) => (
  <Modal
    header="Change Permissions"
    trigger={<a className="teal-text text-darken-3 underline-hover">change permissions</a>}>
    <ChangePermissions
      defaultValue={ defaultValue }
      competition_id={ competition_id }
      user_id = { user_id } />
  </Modal>
);

const memberInfoDisplay = (competition) => {
  // <th className="center-align">Remove</th>
  // <td className="center-align"><a className="black-text"><i className="fa fa-times" aria-hidden="true" /></a></td>

  const membership = competitionMembership(competition, auth.userId());
  const memberView = (user, idx) => {
    const userMembership = competitionMembership(competition, user._id);
    return (
      <tr key={ idx }>
        <td>{ user.name }</td>
        <td>{ user.email }</td>
        <td>{ permissionsDisplay[userMembership] } (<PermissionsModal defaultValue={ userMembership } user_id={ user._id } competition_id={ competition._id } />)</td>
      </tr>
    );
  }
  return (
    <div className="round-container">
      <h3>Roster</h3>
      <Table className="roster">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Membership</th>
          </tr>
        </thead>
        <tbody>
          { competition.directors.map(memberView) }
          { competition.czars.map(memberView) }
          { competition.secure_members.map(memberView) }
          { competition.members.map(memberView) }
        </tbody>
      </Table>
    </div>
  );
}

const MembersTab = ({competition}) => {
  const { content, message, requestStatus } = competition;
  if (content) {
    return memberInfoDisplay(content);
  } else {
    // TODO: spinner
    return <div></div>
  }
}

MembersTab.propTypes = {
  competition: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  competition: state.competitions.competition
});

export default connect(mapStateToProps)(MembersTab);
