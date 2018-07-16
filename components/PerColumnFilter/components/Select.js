import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import SelectDropdown from '~/components/SelectDropdown';

class Select extends React.Component {
  static propTypes = {
    updateFilter: PropTypes.func.isRequired,
    // sometimes you'd want to pass Booleans, but please turn them into strings.
    // because our PassengerModel.types eg is in the form of { true: 'hi' }.
    // true basically plays a role of a string here.
    filter: orFalse(PropTypes.string).isRequired,
    apiSearch: PropTypes.func.isRequired,

    possibleValues: PropTypes.object.isRequired
  }

  updateApiValue = (apiValue) => {
    this.props.updateFilter(apiValue, this.props.apiSearch);
  }

  render = () =>
    <SelectDropdown
      updateValue={this.updateApiValue}
      value={this.props.filter}
      possibleValues={this.props.possibleValues}
      ifClearIsPossible
      placeholder="Select"
    />
}

export default Select;
