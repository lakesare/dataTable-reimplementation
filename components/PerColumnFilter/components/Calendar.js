import React from 'react';
import PropTypes from 'prop-types';

import reactDatesStandardProps from '~/services/reactDatesStandardProps';
import momentPropTypes from 'react-moment-proptypes';

import { DateRangePicker } from 'react-dates';

class Calendar extends React.Component {
  static propTypes = {
    updateFilter: PropTypes.func.isRequired,
    filter: PropTypes.shape({
      from: momentPropTypes.momentObj,
      to:   momentPropTypes.momentObj
    }).isRequired,
    apiSearch: PropTypes.func.isRequired
  }

  state = {
    focusedInput: null
  }

  render = () =>
    <DateRangePicker
      startDate={this.props.filter.from}
      endDate={this.props.filter.to}
      onDatesChange={({ startDate, endDate }) =>
        this.props.updateFilter({ from: startDate, to: endDate }, this.props.apiSearch)
      }

      focusedInput={this.state.focusedInput}
      onFocusChange={(focusedInput) => this.setState({ focusedInput })}

      {...reactDatesStandardProps}
      customInputIcon={null}

      startDatePlaceholderText="From"
      endDatePlaceholderText="To"
    />
}

export default Calendar;
