import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import AddOrRemoveColumns from './components/AddOrRemoveColumns';
import ExportButton from '../ExportButton';

import css from './index.css';

class VerticalToolbar extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    columnDefs: PropTypes.array.isRequired,
    fromApiToHuman: orFalse(PropTypes.func).isRequired,
    perColumnFilters: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired
  }

  state = {
    // speExport: { status: 'success' }
  }

  render = () =>
    <section className={`vertical-toolbar ${css.section}`}>
      <AddOrRemoveColumns columnDefs={this.props.columnDefs}/>

      <ExportButton
        url={this.props.url}
        columnDefs={this.props.columnDefs}
        fromApiToHuman={this.props.fromApiToHuman}
        perColumnFilters={this.props.perColumnFilters}
        order={this.props.order}
      />
    </section>
}

export default VerticalToolbar;
