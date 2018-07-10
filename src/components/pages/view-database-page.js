import * as React from "react";
import { Row, Col, Input } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ProblemPreview } from "../utilities";
import { fetchCompetition, fetchDatabase } from "../../actions";
import { HorizontalNav, VerticalNav, SUBJECTS } from "../utilities";
import QueryDBForm from "../forms/query-db";

const mapStateToProps = state => ({
  competition: state.competitions.competition,
  database: state.problems.database,
});
const mapDispatchToProps = dispatch => ({
  fetchDatabase: id => {
    fetchDatabase(id)(dispatch);
  },
  fetchCompetition: id => {
    fetchCompetition(id)(dispatch);
  },
});

const TitleDumb = ({ database }) => {
  if (!database.content || !database.content.problems) return <div />;
  const { competition } = database.content;

  return (
    <h2 className="teal-text text-darken-4">{ competition.short_name } Database</h2>
  );
}
const Title = connect(mapStateToProps)(TitleDumb);

const ResultsDumb = ({ database }) => {
  if (!database.content || !database.content.problems) return <div />;
  const { problems } = database.content;
  return (
    <Col s={12}>
      <h3>Results</h3>
      {
        problems.map((proposal, key) => (
          <div style={{borderBottom: "1px solid #cfd8dc", paddingTop: "12px"}} key={key}>
            <ProblemPreview problem={proposal} includeClipboard={true}/>
          </div>)
        )
      }
      <div style={{padding: "24px 0"}}>
        <a className="load-more teal-text text-darken-3 underline-hover">Load more...</a>
      </div>
    </Col>
  );
}
const Results= connect(mapStateToProps)(ResultsDumb);

class DatabasePage extends React.Component {
  componentWillMount() {
    const { match, fetchDatabase, fetchCompetition } = this.props;
    fetchDatabase(match.params.id);
    fetchCompetition(match.params.id);
  }

  competitionLink(competition) {
    if (competition){
      return (
        <Link to={ `/view-competition/${ competition._id }` }
              className="waves-effect waves-light btn teal darken-3">
          Return to { competition.short_name } Home
        </Link>
      )
    } else {
      return <div></div>
    }
  }

  renderProblems(problems) {
    return problems.length > 0 ? (
      <Col s={12}>
        {
          problems.map((proposal, key) => (
            <div style={{borderBottom: "1px solid #cfd8dc", paddingTop: "12px"}} key={key}>
              <ProblemPreview problem={proposal}/>
            </div>)
          )
        }
      </Col>
    ) : (
      <Col s={12}>
        <div>No problems yet!</div>
      </Col>
    );
  }

  renderSubjects(problems, thisPageUrl) {
    let subjectTabs = {
      '_all': {
        title: () => <div><i aria-hidden="true"/> All </div>,
        to: thisPageUrl,
        view: () => this.renderProblems(problems),
      },
    };
    for (const subject of SUBJECTS) {
      subjectTabs[subject] = {
        title: () => <div><i aria-hidden="true"/> {subject} </div>,
        to: thisPageUrl,
        view: () => this.renderProblems(problems.filter(
          problem => problem.subject == subject
        )),
      };
    }
    subjectTabs['_misc'] = {
      title: () => <div><i aria-hidden="true"/> Other </div>,
      to: thisPageUrl,
      view: () => this.renderProblems(problems.filter(
        problem => {
          for (const subject of SUBJECTS) {
            if (problem.subject == subject) {
              return false;
            }
          }
          return true;
        }
      )),
    };
    return <VerticalNav tabs={ subjectTabs } active={ '_all' }/>;
  }

  render() {
    const { match, competition, database } = this.props;
    const { content } = competition;
    const thisPageUrl = `/view-database/${match.params.id}`;

    const competitionLink = this.competitionLink(content);
    const subjectTabs = ( database.content && database.content.problems ) ? (
      this.renderSubjects(database.content.problems, thisPageUrl)
    ) : <div />;
    // <QueryDBForm competition_id={ match.params.id } />
    // <Results />
    return (
      <Row className="container">
        <Col s={12}>
          <div style={{marginTop: "36px"}}>
            { competitionLink }
            <Title />
            { subjectTabs }
          </div>
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabasePage);
