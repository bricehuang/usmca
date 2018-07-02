import * as React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input } from "react-materialize";
import { connect } from "react-redux";
import _ from "lodash"
import { Link } from "react-router-dom";

import auth from "../../auth";
import renderKaTeX from "../../katex";
import { getProposal, upvoteProblem, removeTestProb } from "../../actions";
import { requestStatuses } from "../../actions/types";
import { ProblemPreview, ExtendedProblemPreview, Solution, HorizontalNav, Counter } from "../utilities";
import TestSolveForm from "../forms/test-solve";
import SolutionForm from "../forms/solution";
import CommentForm from "../forms/comment";
import AssignProblem from "../forms/assign-problem";
import Spinner from "../spinner";
import Error from "../error";
const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

class Vote extends React.Component {
  toggle = () => {
    this.upvote.className = "upvoted";
  }

  render() {
    const { type, netVotes, onClick } = this.props;

    return (<div>
      <ul className={"clear-top center-align " + type}>
        <li ref={ elem => {this.upvote = elem;} }><a><i className="fa fa-arrow-up" aria-hidden="true" onClick={ onClick } /></a> {netVotes}</li>
      </ul>
    </div>);
  }
}

const getAllTests = (contests) => {
  let tests = [];
  for (const contest of contests) {
    for (const test of contest.tests) {
      tests.push({contest: contest.name, test: test.name, _id: test._id});
    }
  }
  tests.reverse();
  return tests;
}

const findProbIfInTest = (searchProblemId, contests) => {
  for (const contest of contests) {
    for (const test of contest.tests) {
      for (const problem of test.problems) {
        const probId = problem._id ? problem._id : problem;
        if (probId == searchProblemId) {
          return {
            contest: {_id: contest._id, name: contest.name},
            test: {_id: test._id, name: test.name}
          }
        }
      }
    }
  }
  return null;
}

const linkToProblemLocation = (problemLocation) => {
  if (problemLocation) {
    return (
      <div>
        Usage: Test <a href={`./view-test/${problemLocation.test._id}`}>{problemLocation.test.name}</a> in
        Contest <a href={`./view-contest/${problemLocation.contest._id}`}>{problemLocation.contest.name}</a>.
      </div>
    )
  } else {
    return (<div>Usage: Currently not assigned to a test.  </div>)
  }
}

class ViewProbPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { match, getProposal } = this.props;
    getProposal(match.params.id);
  }

  // toggleDiscussion = () => {
  //   this.state.showDiscussion = !this.state.showDiscussion;
  //   this.forceUpdate();
  // }

  upvoted = () => {
    const { proposal: { content } } = this.props,
          problem = content;
    return !!(_.find(problem.upvotes, id => id === auth.userId()));
  }

  render() {
    const {
            proposal,
            upvoteProblem,
          } = this.props,
          problem = proposal.content;
    const childProps = {
            "info": problem,
            "answer": problem,
            "solutions": problem,
            "test-solves": problem
          },
          headerProps = {
            "solutions": problem,
            "test-solves": problem
          },
          upvotes = problem ? problem.upvotes : [];
//          <a className="teal-text text-darken-3 underline-hover" onClick={ this.toggleDiscussion }>
//            <h3><i className="fa fa-caret-up" aria-hidden="true"/> Hide Discussion</h3>
//          </a>
// : (
//   <div className="toggle-discussion">
//     <a className="teal-text text-darken-3 underline-hover" onClick={ this.toggleDiscussion }>
//       <h3><i className="fa fa-caret-down" aria-hidden="true"/> Show Discussion</h3>
//     </a>
//   </div>
// )
// <Col s={12}>
//   {
//    <div className="discussion">
//      <HorizontalNav
//        tabs={ this.problemTabs() }
//        active="info"
//        childProps={ childProps }
//        headerProps={ headerProps }/>
//    </div>
//  }
//</Col>

    if (proposal.requestStatus === PENDING) {
      return <Spinner />;
    } else if (problem) {
      const problemLocation = findProbIfInTest(problem._id, problem.competition.contests);
      let assignOrRemoveProblem;
      if (!problemLocation) {
        assignOrRemoveProblem = (
          <div>
            <h3>Assign Problem</h3>
            <AssignProblem
            tests={getAllTests(problem.competition.contests)}
            prob={problem._id}
            />
          </div>
        )
      } else {
        const returnProblem = (test_id, problem_id) => {
          this.props.removeTestProb(test_id, problem_id);
          window.location.reload();
        }
        assignOrRemoveProblem = (
          <div>
            <a onClick={() => returnProblem(problemLocation.test._id, problem._id)}>
            Return problem to database.
            </a>
          </div>
        )
      }

      return (
        <Row className="container">
          <div style={{marginTop: "36px"}}>
            <Link to={ `/view-database/${problem.competition._id}` } className="waves-effect waves-light btn teal darken-3">Return to { problem.competition.short_name } Database</Link><br /><br />
            <div style={{borderTopStyle: "solid", borderTopWidth: "1px"}}>
              <h3>Problem </h3>
              <ExtendedProblemPreview
                problem={ problem }
                upvoted={ upvotes.indexOf(auth.userId()) > -1 }
                onUpvote={ () => { upvoteProblem(problem._id); } } />
            </div>
            <div style={{borderTopStyle: "solid", borderTopWidth: "1px"}}>
              <h3>Answer </h3>
              <p ref={ renderKaTeX }>{ problem.answer || 'No answer provided.' }</p>
            </div>
            <div style={{borderTopStyle: "solid", borderTopWidth: "1px"}}>
              <h3>Solution </h3>
              {
                problem.soln ? (
                  <Solution solution={ problem.soln } />
                ): ( <p>No solution.</p> )
              }
            </div>
            <div style={{borderTopStyle: "solid", borderTopWidth: "1px"}}>
              <h3>Information </h3>
              <ul>
                <li>Author: { problem.author.name }</li>
                <li>Subject: { problem.subject }</li>
                <li>Difficulty: { problem.difficulty || 'N/A' }</li>
                <li>{linkToProblemLocation(problemLocation)} </li>
              </ul>
              {assignOrRemoveProblem}
            </div>
          </div>
        </Row>
      )
    } else {
      return (
        <Row className="container">
          <div style={{marginTop: "36px"}}>
            <Error error={ proposal.requestStatus === ERROR } message={ proposal.message }/>
          </div>
        </Row>
      )
    }
  }
}

const mapStateToProps = state => ({
        proposal: state.problems.proposal,
      }),
      mapDispatchToProps = dispatch => ({
        getProposal: id => {
          getProposal(id)(dispatch);
        },
        upvoteProblem: id => {
          upvoteProblem(id)(dispatch);
        },
        removeTestProb: (test_id, problem_id) => {
          removeTestProb(test_id, problem_id)(dispatch);
        },
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(ViewProbPage);
