import * as React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input } from "react-materialize";
import { connect } from "react-redux";
import _ from "lodash"
import { Link } from "react-router-dom";

import auth from "../../auth";
import renderKaTeX from "../../katex";
import { getProposal, upvoteProblem, getTestOfProposal } from "../../actions";
import { requestStatuses } from "../../actions/types";
import { ProblemPreview, ExtendedProblemPreview, Solution, HorizontalNav, Counter } from "../utilities";
import TestSolveForm from "../forms/test-solve";
import SolutionForm from "../forms/solution";
import CommentForm from "../forms/comment";
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

class ViewProbPage extends React.Component {
  constructor(props) {
    super(props);
  }

  problemTabs = () => {
    return ({
      "info": {
        title: () => "Information",
        view: (problem) => (
          <ul>
            <li>Author: { problem.author.name }</li>
            <li>Subject: { problem.subject }</li>
            <li>Competition: { problem.publicDatabase ? <span className="bold-text">Public Database</span> : problem.competition.short_name }</li>
            <li>Difficulty: { problem.difficulty || 'N/A' }</li>
          </ul>
        )
      },
      "answer": {
        title: () => "Answer",
        view: (problem) => <p ref={ renderKaTeX }>{ problem.answer || 'No answer provided.' }</p>
      },
      "solutions": {
        title: (problem) => <div>Solutions<Counter count={ problem.official_soln.length } /></div>,
        view: (problem) => (
          <div>
            <h3>Author Solution</h3>
            {
              problem.soln ? (
                <Solution solution={ problem.soln } />
              ): ( <p>No author solution.</p> )
            }
            <h3>Other Accepted Solutions</h3>
            {
              problem.official_soln.length > 0 ? (
              <ul>
                {
                  problem.official_soln.map((soln, key) => (
                    <Solution solution={soln} key={key} />
                  ))
                }
              </ul>
              ) : ( <p>No other solutions.</p> )
            }
          </div>
        )
      },
      // "test-solves": {
      //   title: (problem) => <div>Test Solves<Counter count={ problem.alternate_soln.length } /></div>,
      //   view: (problem) => (
      //     <div>
      //       <div>
      //         <TestSolveForm problem_id={ problem._id }/>
      //       </div>
      //       {
      //         (problem.alternate_soln.length > 0) ? (
      //           <ul>
      //             {
      //               _(_.sortBy(problem.alternate_soln, "updated"))
      //               .reverse().value().map((soln, key) => (
      //                 <Solution solution={soln} key={key} />
      //               ))
      //             }
      //           </ul>
      //         ) : ( <p>No test solves.</p> )
      //       }
      //    </div>
      //   )
      // }
    })
  }

  componentWillMount() {
    const { match, getProposal, getTestOfProposal } = this.props;
    getProposal(match.params.id);
    getTestOfProposal(match.params.id);
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
            testOfProposal,
            upvoteProblem,
          } = this.props,
          problem = proposal.content;
    console.log(testOfProposal.content);
    console.log(problem);
    console.log(this.props.competition.content);
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

    return (
      <div>
      { (proposal.requestStatus === PENDING) && <Spinner /> }
      {
        problem ? (
          <Row className="container">
            <div style={{marginTop: "36px"}}>
              <Link to={ `/view-competition/${problem.competition._id}` } className="waves-effect waves-light btn teal darken-3">Return to { problem.competition.short_name } Home</Link><br /><br />
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
                  <li>Competition: { problem.publicDatabase ? <span className="bold-text">Public Database</span> : problem.competition.short_name }</li>
                  <li>Difficulty: { problem.difficulty || 'N/A' }</li>
                </ul>

              </div>
            </div>
          </Row>
        ) : (
          <Row className="container">
            <div style={{marginTop: "36px"}}>
              <Error error={ proposal.requestStatus === ERROR } message={ proposal.message }/>
            </div>
          </Row>
        )
      }
      </div>
    )
  }
}

const mapStateToProps = state => ({
        competition: state.competitions.competition,
        proposal: state.problems.proposal,
        testOfProposal: state.problems.testOfProposal,
      }),
      mapDispatchToProps = dispatch => ({
        getProposal: id => {
          getProposal(id)(dispatch);
        },
        getTestOfProposal: id => {
          getTestOfProposal(id)(dispatch);
        },
        upvoteProblem: id => {
          upvoteProblem(id)(dispatch);
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(ViewProbPage);
