import * as React from "react";
import { Row, Col, Collection, CollectionItem } from "react-materialize";

const About = () => (
  <Row className="container">
    <Col s={12}>
      <h2>About USMCA</h2>
      <p>
        Welcome to the USMCA problem submissions site! This document will explain the website features and how to use them.
      </p>

      <p>
        Please direct all bug reports, questions, and feature requests to the <a href="https://github.com/bricehuang/usmca/issues">issues page</a>.
      </p>

      <h2>Definitions</h2>
      <p>
        For standardization purposes, we formalize some terminology here:
      </p>
      <Collection>
        <CollectionItem>A <span className="bold-text">competition</span> is an organization, such as PUMaC or CMIMC, that hosts contests.</CollectionItem>
        <CollectionItem>A <span className="bold-text">contest</span> is a single event by a participating organization, e.g. PUMaC 2018. An organization can have multiple contests.</CollectionItem>
        <CollectionItem>A <span className="bold-text">test</span> is a single round of a contest, such as CMIMC Algebra Round or PUMaC Individual Finals.</CollectionItem>
        <CollectionItem>A <span className="bold-text">problem</span> is, well, a problem. It is important to note that multi-part problems may be considered separate problems for accounting purposes, such as those often present in power round.</CollectionItem>
      </Collection>

      <h2>Problem Database Structure</h2>
      <p>
        Each competition has a problem database, which they will use for all their contests.
        Anyone affiliated with a competition can submit problems to it.
        Directors, Czars, and Officers can view the contents of the competition's database.
      </p>

      <h2>Member Types and Permissions</h2>
      <p>
        Members of a contest can have various roles, which come with different permissions.
        There are 4 classes of members:
      </p>
      <Collection>
        <CollectionItem>
          <span className="bold-text">Director</span>:
          Directors “own” their competition, and thus have access to all aspects of it.
          In addition to Czars’ permissions, Directors may change the permissions of
          their competition’s members, invite new members to join the competition,
          and approve new members’ requests to join.
        </CollectionItem>
        <CollectionItem>
          <span className="bold-text">Czar</span>:
          Problem czars are the head problem writers for their competitions.
          They have full control over their competition’s database and contests.
          In addition to Officers’ permissions, czars can create new contests and tests,
          and assign and unassign problems from the database to a contest.
        </CollectionItem>
        <CollectionItem>
          <span className="bold-text">Officers</span>:
          In addition to Members’ permissions, Officers can view their competition’s
          database, and have edit access to all problems.
        </CollectionItem>
        <CollectionItem>
          <span className="bold-text">Member</span>:
          Members can propose problems to a competition and have edit access to their
          own proposals.
        </CollectionItem>
      </Collection>
    </Col>
  </Row>
);

export default About;
