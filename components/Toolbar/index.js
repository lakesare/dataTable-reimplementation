import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import ExportButton from '~/components/DataTable/components/ExportButton';

class Toolbar extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    columnDefs: PropTypes.array.isRequired,
    fromApiToHuman: orFalse(PropTypes.func).isRequired,
    perColumnFilters: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired,

    toolbarInsides: orFalse(PropTypes.element).isRequired,
    excelExportFileName: PropTypes.string.isRequired,
    excelExportWorksheetName: PropTypes.string.isRequired
  }

  render = () =>
    <section className="toolbar standard-toolbar">
      {
        this.props.toolbarInsides ||
        <div/> // for space-between layout to work (moves :Export to the right)
      }

      <ExportButton
        url={this.props.url}
        columnDefs={this.props.columnDefs}
        fromApiToHuman={this.props.fromApiToHuman}
        perColumnFilters={this.props.perColumnFilters}
        order={this.props.order}
        excelExportFileName={this.props.excelExportFileName}
        excelExportWorksheetName={this.props.excelExportWorksheetName}
      />
    </section>
}

export default Toolbar;
