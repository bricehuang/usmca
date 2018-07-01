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
import {
  DIRECTOR, PENDING_DIRECTOR, CZAR, SECURE, MEMBER, NONMEMBER, competitionMembership, makeURL
} from "../utilities";

class CompetitionsPage extends React.Component {
  componentWillMount() {
    this.props.memberCompetitions();
  }

  competitionInfoSummary(competition) {
    const membership = competitionMembership(competition, auth.userId());
    return (
      <div className="round-container">
        <ul>
          <li><h3>Competition Info<a className="right black-text"><i className="fa fa-pencil" aria-hidden="true" /></a></h3></li>
          <li>Name: { competition.name }</li>
          <li>Short name: { competition.short_name }</li>
          <li>Website: { (competition.website) ? <a href={ makeURL(competition.website) } className="teal-text text-darken-3 underline-hover">{ competition.website }</a> : "N/A"}</li>
          <div>
            <li><h3>Competition Portal</h3></li>
            <li><Link to={ `/view-competition/${competition._id}` } className="waves-effect waves-light btn teal darken-3">Enter Competition</Link></li>
          </div>
        </ul>
      </div>
    )
  }

  render () {
    // console.log(this.props.competitions.content);
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
                      {this.competitionInfoSummary(competition)}
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
