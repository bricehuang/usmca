import * as React from "react";
import { Row } from "react-materialize";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import InfoTab from "./view-competition-page/info-tab";
import ContestsTab from "./view-competition-page/contests-tab";
import MyProblemsTab from "./view-competition-page/my-problems-tab";
import { HorizontalNav } from "../utilities";
import { fetchCompetition } from "../../actions"
import auth from "../../auth";
import Spinner from "../spinner";
import Error from "../error";
import { requestStatuses } from "../../actions/types";
const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

const Title = ({ fa, title}) => (
  <div><i className={ "fa fa-"+fa } aria-hidden="true"/> { title }</div>
);

class ViewCompetitionPage extends React.Component {
  componentWillMount() {
    const { match, fetchCompetition } = this.props;
    fetchCompetition(match.params.id);
  }

  render() {
    const {competition: { content, message, requestStatus }, match } = this.props;
    console.log('THIS IS THE COMPETITION');
    console.log(content);

    if (content) {
      let competitionTabs = {
        "info": {
          title: () => <Title fa="trophy" title="Info" />,
          to: '/view-competition/info',
          view: () => <InfoTab />
        },
        "contests": {
          title: () => <Title fa="trophy" title="Contests" />,
          to: '/view-competition/contests',
          view: () => <ContestsTab />
        },
        "problems": {
          title: () => <Title fa="pencil-square" title="My Proposals"/>,
          to: "/view-competition/problems",
          view: () => <MyProblemsTab />
        },
        "competitions": {
          title: () => <Title fa="trophy" title="Competitions"/>,
          to: "/view-competition/competitions",
          view: () => <div />
        },
      };

      let active = match.params.tab || "info";
      if (!(_.find(_.keys(competitionTabs), tab => tab === active))) {
        active = "info";
      }

      return (
        <Row className="container">
          <h2 className="teal-text text-darken-3">{ content.short_name }</h2>
          <HorizontalNav tabs={ competitionTabs } active={ active }/>
        </Row>
      );
    } else if (requestStatus === ERROR) {
      return (
        <Row className="container">
          <div style={{marginTop: "36px"}}>
            <Error error={ true } message={ message }/>
          </div>
        </Row>
      );
    } else if (requestStatus === PENDING) {
      return (
        <Row className="container">
          <div style={{marginTop: "36px"}}>
            <Spinner />
          </div>
        </Row>
      );
    } else {
      return <div></div>
    }

  }

  // if (auth.isAdmin()) {
  //   competitionTabs.admin = {
  //     title: () => <Title fa="lock" title="Admin"/>,
  //     to: "/home/admin",
  //     view: () => <h1>Admin</h1>
  //   }
  // }

  // let active = match.params.tab || "competitions";
  // if (!(_.find(_.keys(accountTabs), tab => tab === active))) {
  //   active = "competitions";
  // }
}

const mapStateToProps = state => ({
  competition: state.competitions.competition
});
const mapDispatchToProps = dispatch => ({
  fetchCompetition: id => {
    fetchCompetition(id)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCompetitionPage);
