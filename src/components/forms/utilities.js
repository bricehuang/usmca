import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input, Row, Col } from "react-materialize";
import _ from "lodash";

import { 
  allCompetitions, 
  memberCompetitions, 
  directorCompetitions 
} from "../../actions";
import Autocomplete from "../react-materialize-custom/Autocomplete";
import AutocompleteSelect from "../react-materialize-custom/AutocompleteSelect";
import ControlledInput from "../react-materialize-custom/ControlledInput";

/*******************************************************************************
 * Autocomplete for competitions.
 ******************************************************************************/

const competitionsInputOptions = {
  ALL: "all",
  MEMBER: "member",
  DIRECTOR: "director"
}


class CompetitionsInputDumb extends React.Component {
  componentWillMount() {
    switch (this.props.type) {
      case (competitionsInputOptions.ALL):
        this.props.allCompetitions(); 
        break;
      case (competitionsInputOptions.MEMBER):
        this.props.memberCompetitions(); 
        break;
      case (competitionsInputOptions.DIRECTOR):
        this.props.directorCompetitions(); 
        break;
      default:
        this.props.allCompetitions();
    }
  }

  competitionObject = () => {
    const { competitions, type } = this.props;
    let a = competitions[type]; 
    if (type === competitionsInputOptions.MEMBER) {
      a = a.map(competitionInfo => competitionInfo.competition);
    }
    return _.reduce(a, (o, comp) => Object.assign(o, { 
      [comp.short_name]: comp._id 
    }), {});
  };

  render() {
    const { 
      competitions, 
      allCompetitions,
      memberCompetitions,
      directorCompetitions,
      type,
      input, 
      meta,
      ...rest 
    } = this.props;
    return (
      <AutocompleteSelect
        s={12} title="Competition" { ...input } { ...rest } 
        data={ this.competitionObject() } limit={5} />
    );
  }
};
CompetitionsInputDumb.propTypes = {
  competitions: PropTypes.object.isRequired,
  allCompetitions: PropTypes.func.isRequired,
  memberCompetitions: PropTypes.func.isRequired,
  directorCompetitions: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
const mapStateToPropsCompetitionsInputDumb = state => ({
        competitions: {
          [competitionsInputOptions.ALL]: state.competitions.allCompetitions,
          [competitionsInputOptions.MEMBER]: state.competitions.memberCompetitions,
          [competitionsInputOptions.DIRECTOR]: state.competitions.directorCompetitions
        }
      }),
      mapDispatchToPropsCompetitionsInputDumb = dispatch => ({
        allCompetitions: () => {
          allCompetitions()(dispatch);
        },
        memberCompetitions: () => {
          memberCompetitions()(dispatch);
        },
        directorCompetitions: () => {
          directorCompetitions()(dispatch);
        }
      });
const CompetitionsInput = connect(
  mapStateToPropsCompetitionsInputDumb, 
  mapDispatchToPropsCompetitionsInputDumb
)(CompetitionsInputDumb);

/*******************************************************************************
 * Select for competitions
 ******************************************************************************/

class CompetitionsSelectDumb extends React.Component {
  componentWillMount() {
    switch (this.props.type) {
      case (competitionsInputOptions.ALL):
        this.props.allCompetitions(); 
        break;
      case (competitionsInputOptions.MEMBER):
        this.props.memberCompetitions(); 
        break;
      case (competitionsInputOptions.DIRECTOR):
        this.props.directorCompetitions(); 
        break;
      default:
        this.props.allCompetitions();
    }
  }

  competitionObject = () => {
    const { competitions, type } = this.props;
    let a = competitions[type]; 
    if (type === competitionsInputOptions.MEMBER) {
      a = a.map(competitionInfo => competitionInfo.competition);
    }
    return _.reduce(a, (o, comp) => Object.assign(o, { 
      [comp.short_name]: comp._id 
    }), {});
  };

  render() {
    const { 
      competitions, 
      allCompetitions,
      memberCompetitions,
      directorCompetitions,
      type,
      input, 
      meta,
      ...rest 
    } = this.props;
    return (
      <Input s={12} type="select" label="Competition" { ...input } { ...rest }>
        <option value="">Select a Competition</option>
        {
          _.entries(this.competitionObject()).map(([ short_name, id ], idx) => (
            <option key={ idx } value={ id }>{ short_name }</option>
          ))
        }
      </Input>
    );
  }
};
CompetitionsSelectDumb.propTypes = {
  competitions: PropTypes.object.isRequired,
  allCompetitions: PropTypes.func.isRequired,
  memberCompetitions: PropTypes.func.isRequired,
  directorCompetitions: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
const mapStateToPropsCompetitionsSelectDumb = state => ({
        competitions: {
          [competitionsInputOptions.ALL]: state.competitions.allCompetitions,
          [competitionsInputOptions.MEMBER]: state.competitions.memberCompetitions,
          [competitionsInputOptions.DIRECTOR]: state.competitions.directorCompetitions
        }
      }),
      mapDispatchToPropsCompetitionsSelectDumb = dispatch => ({
        allCompetitions: () => {
          allCompetitions()(dispatch);
        },
        memberCompetitions: () => {
          memberCompetitions()(dispatch);
        },
        directorCompetitions: () => {
          directorCompetitions()(dispatch);
        }
      });
const CompetitionsSelect = connect(
  mapStateToPropsCompetitionsSelectDumb, 
  mapDispatchToPropsCompetitionsSelectDumb
)(CompetitionsSelectDumb);

/*******************************************************************************
 * Array of locations input for contests.
 ******************************************************************************/

class LocationArrayInput extends React.Component {
  constructor() {
    super();

    this.state = {
      site: '',
      address: '',
      value: []
    };
  }

  renderList = () => {
    return this.state.value.map((loc, idx) => (
      <Row key={idx}>
        <Col s={5}>{ loc.site }</Col>
        <Col s={6}>{ loc.address }</Col>
        <Col s={1}>
          <h1>
            <a onClick={ this.handleRemoveClick(idx) }>
              <i className="fa fa-times" aria-hidden="true"></i>
            </a>
          </h1>
        </Col>
      </Row>
    ));
  }

  handleAddClick = () => {
    if (!this.state.site) return;
    this.state.value.push({ 
      site: this.state.site, 
      address: this.state.address
    }); 
    this.state.site = "";
    this.siteInput._onChange({
      target: { value: "" }
    }, "");
    this.state.address = "";
    this.addressInput._onChange({
      target: { value: "" }
    }, "");
 
    const { onChange } = this.props; 
    if (onChange) onChange(this.state.value);
    this.forceUpdate();
  }

  handleRemoveClick = locIdx => (
    () => {
      _.remove(this.state.value, (val, idx) => (idx === locIdx));

      const { onChange } = this.props; 
      if (onChange) onChange(this.state.value);
      this.forceUpdate();
    }
  )

  render() {
    const siteLabel = "Site Name",
          addressLabel = "Address (optional)";
    return (
      <div>
        {
          this.renderList()
        }
        <ControlledInput 
          type="text" 
          label={siteLabel} 
          s={5}
          ref={ elem => { this.siteInput = elem; } }
          onChange={(evt, val) => { this.state.site = evt.target.value; } } />
        <ControlledInput 
          type="text" 
          label={addressLabel} 
          s={6}
          ref={ elem => { this.addressInput = elem; } }
          onChange={(evt, val)=> { this.state.address = evt.target.value; } } />
        <Col s={1}>
          <h1>
            <a onClick={ this.handleAddClick }>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </a>
          </h1>
        </Col>
      </div>
    );
  }
}

/*******************************************************************************
 * Subjects input.
 ******************************************************************************/

const subjects = {
  "Algebra": null,
  "Combinatorics": null,
  "Computer Science": null,
  "Geometry": null,
  "Number Theory": null
}

const SubjectsInput = props => {
  return (
    <Autocomplete
      s={12} title="Subject" { ...props }
      data={ subjects } limit={5} />
  );
}

export {
  competitionsInputOptions,
  CompetitionsInput,
  CompetitionsSelect,
  LocationArrayInput,
  SubjectsInput
};
