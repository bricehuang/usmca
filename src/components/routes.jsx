import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";

import requireAuth from "./auth/require-auth";

import * as Pages from "./pages";

const Routes = ({ authenticated }) => (
  <Switch>
    <Route exact path="/" component={ authenticated ? Pages.NotificationsPage : Pages.IndexPage } />
    <Route exact path="/home" component={ authenticated ? Pages.NotificationsPage : Pages.IndexPage }/>
    <Route exact path="/login" component={ Pages.LoginPage }/>
    <Route exact path="/propose/:competition_id" component={ requireAuth(Pages.Propose) }/>
    <Route exact path="/account" component={ requireAuth(Pages.AccountInfoPage) }/>
    <Route exact path="/competitions" component={ requireAuth(Pages.CompetitionsPage) }/>
    <Route exact path="/about" component={ Pages.About }/>;
    <Route exact path="/view-competition/:id" component={ Pages.ViewCompetitionPage }/>
    <Route path="/view-contest/:id" component={ requireAuth(Pages.ViewContestPage) }/>
    <Route path="/view-database/:id" component={ requireAuth(Pages.ViewDatabasePage) }/>
    <Route path="/view-test/:id" component={ requireAuth(Pages.ViewTestPage) }/>
    <Route path="/view-problem/:id" component={ requireAuth(Pages.ViewProblemPage) }/>
    <Route path="/edit-problem/:problem_id" component={ requireAuth(Pages.Propose) }/>
    <Route path="*" component={ Pages.NotFoundPage } />
  </Switch>
);

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
        authenticated: !!state.auth.authenticated.content
      });

export default withRouter(
  connect(
    mapStateToProps
  )(Routes)
);
