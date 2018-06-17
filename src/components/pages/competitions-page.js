import * as React from "react";
import { Button, Col, Table, Input, Modal, Row } from "react-materialize";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";

import auth from "../../auth";
import { memberCompetitions } from "../../actions";
import { RightButtonPanel, VerticalNav } from "../utilities";
import CreateContestForm from "../forms/create-contest";
import CreateCompetitionForm from "../forms/create-competition";
import JoinCompetitionForm from "../forms/join-competition";
import * as Forms from "../forms";
import { permissionsDisplay } from "../../../constants";

const makeURL = url => {
  if (!url) return url;
  const http = "http://",
        https = "https://",
        valid = (url.substr(0, http.length) === http) ||
                (url.substr(0, https.length) === https);
  return valid ? url : http + url;
}

const DIRECTOR = "director",
      PENDING_DIRECTOR = "pending_director",
      CZAR = "czar",
      SECURE = "secure_member",
      MEMBER = "member",
      NONMEMBER = "nonmember";

const competitionMembership = (competition, userId, populated = true) => {
  const finder = populated ?
    user => user._id === userId : // users are populated
    user => user === userId; // users are ids themselves
  if (_.find(competition.directors, finder))
    return competition.valid ? DIRECTOR : PENDING_DIRECTOR;
  else if (_.find(competition.czars, finder)) return CZAR;
  else if (_.find(competition.secure_members, finder)) return SECURE;
  else if (_.find(competition.members, finder)) return MEMBER;
  else return NONMEMBER;
}

class CompetitionsPage extends React.Component {
  componentWillMount() {
    this.props.memberCompetitions();
  }

  competitionInfo(competition) {
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
            (membership === DIRECTOR || membership === SECURE) && (
              <div>
                <li><h3>Competition Portal</h3></li>
                <li><Link to={ `/view-competition/${competition._id}` } className="waves-effect waves-light btn teal darken-3">Enter Competition</Link></li>
              </div>
            )
          }
        </ul>
      </div>
    )
  }

  render () {
    const { competitions: { content, message, requestStatus } } = this.props;
    return (
      <Row className="container">
        <Col s={12}>
          <div style={{marginTop: "36px"}}>
            <Modal
              header="Request to Join a Competition"
              trigger={ <Button className="teal darken-3" waves="light">Join a competition</Button> }>
              <JoinCompetitionForm />
            </Modal>
              {
                content && content.map((competition, idx) => (
                  <div key={idx}>
                    <h2 className="teal-text text-darken-3">{ competition.short_name }</h2>
                    <div style={{borderBottom: "1px solid #cfd8dc"}}>
                      {this.competitionInfo(competition)}
                    </div><br />
                  </div>
                ))
              }
            <RightButtonPanel>
              Does your competition want to join USMCA? <Modal header="Form a Competition" trigger={<a className="teal-text text-darken-3 underline-hover">Register your competition.</a>}>
                <CreateCompetitionForm />
              </Modal>
            </RightButtonPanel>
          </div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
        competitions: state.competitions.memberCompetitions
      }),
      mapDispatchToProps = dispatch => ({
        memberCompetitions: () => { memberCompetitions({ info: true })(dispatch); }
      });

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionsPage);
