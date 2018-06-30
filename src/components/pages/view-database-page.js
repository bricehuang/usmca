import * as React from "react";
import { Row, Col, Input } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ProblemPreview } from "../utilities";
import { fetchCompetition, fetchDatabase } from "../../actions";
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
          Return to { competition.name } Home
        </Link>
      )
    } else {
      return <div></div>
    }
  }

  render() {
    const { match, competition } = this.props;
    const { content } = competition;
    console.log('DATABASE');
    console.log(this.props.database);

    return (
      <Row className="container">
        <Col s={12}>
          <div style={{marginTop: "36px"}}>
            <Title />
            { this.competitionLink(content) }
            <QueryDBForm competition_id={ match.params.id } />
            <Results />
          </div>
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabasePage);
