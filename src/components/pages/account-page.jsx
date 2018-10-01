import * as React from "react";
import { Row } from "react-materialize";
import { Link } from "react-router-dom";
import _ from "lodash";

import CompetitionsTab from "./account-page/competitions-tab";
import ProblemsTab from "./account-page/problems-tab";
import { HorizontalNav } from "../utilities";
import auth from "../../auth";

const Title = ({ fa, title}) => (
  <div><i className={ "fa fa-"+fa } aria-hidden="true"/> { title }</div>
);

const AccountPage = ({ match }) => {
  let accountTabs = {
    "competitions": {
      title: () => <Title fa="trophy" title="Competitions"/>,
      to: "/home/competitions",
      view: () => <CompetitionsTab />
    },
    "problems": {
      title: () => <Title fa="pencil-square" title="Problems"/>,
      to: "/home/problems",
      view: () => <ProblemsTab />
    },
  };

  if (auth.isAdmin()) {
    accountTabs.admin = {
      title: () => <Title fa="lock" title="Admin"/>,
      to: "/home/admin",
      view: () => <h1>Admin</h1>
    }
  }

  let active = match.params.tab || "competitions";
  if (!(_.find(_.keys(accountTabs), tab => tab === active))) {
    active = "competitions";
  }

  return (
    <Row className="container">
      <HorizontalNav tabs={ accountTabs } active={ active }/>
    </Row>
  );
}

export default AccountPage;
