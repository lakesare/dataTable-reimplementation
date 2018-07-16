import React from 'react';
import PropTypes from 'prop-types';

import Text from './components/Text';
import Calendar from './components/Calendar';
import Select from './components/Select';

import css from './index.scss';

class PerColumnFilter extends React.Component {
  static propTypes = {
    columnDef: PropTypes.object.isRequired,
    perColumnFilters: PropTypes.array.isRequired,
    updatePerColumnFilters: PropTypes.func.isRequired,
    apiSearch: PropTypes.func.isRequired,
  }

  updatePerColumnFilters = (data, filter, callback) => {
    const prevFilters = this.props.perColumnFilters;
    const updatedFilterIndex = prevFilters.findIndex((li) => li.data === data);
    const newFilters = [
      ...prevFilters.slice(0, updatedFilterIndex),
      { data, filter },
      ...prevFilters.slice(updatedFilterIndex + 1)
    ];

    this.props.updatePerColumnFilters(newFilters, callback);
  }

  renderInput = (columnDef, perColumnFilter) => {
    const props = {
      updateFilter: (filter, callback) => this.updatePerColumnFilters(columnDef.data, filter, callback),
      filter: perColumnFilter.filter,
      apiSearch: this.props.apiSearch
    };
    switch (columnDef.search.type) {
      case 'text': return <Text {...props}/>;
      case 'calendar': return <Calendar {...props}/>;
      case 'select': return <Select {...props} possibleValues={columnDef.search.possibleValues}/>;
      default: throw new Error(`columnDef.search.type can't be '${columnDef.search.type}'`);
    }
  }

  render = () => {
    const columnDef = this.props.columnDef;

    // if for this <th/> we don't have :search defined
    if (!columnDef.search) return null;

    // find perColumnFilter for this columnDef
    const perColumnFilter = this.props.perColumnFilters
      .find((pcf) => pcf.data === columnDef.data);

    return <section className={`per-column-filter ${columnDef.search.type} ${css['per-column-filter']}`}>
      {this.renderInput(columnDef, perColumnFilter)}
    </section>;
  }
}

export default PerColumnFilter;
