import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import dataTableFetch from '~/api/services/dataTableFetch';
import stateToRequestBody from '~/components/DataTable/services/stateToRequestBody';
import fromStateToExcel from '~/components/DataTable/services/fromStateToExcel';
import createAndDownloadExcelFile from '~/services/createAndDownloadExcelFile';

import Loading from '~/components/Loading';

class ExportButton extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    columnDefs: PropTypes.array.isRequired,
    fromApiToHuman: orFalse(PropTypes.func).isRequired,
    perColumnFilters: PropTypes.array.isRequired,
    order: PropTypes.object.isRequired,
    excelExportFileName: PropTypes.string.isRequired,
    excelExportWorksheetName: PropTypes.string.isRequired
  }

  state = {
    speExport: { status: 'success' }
  }

  convertToExcel = (arrayOfRecords) => {
    const arrayOfHashes = fromStateToExcel(arrayOfRecords, this.props.fromApiToHuman, this.props.columnDefs);
    createAndDownloadExcelFile(arrayOfHashes, this.props.excelExportFileName, this.props.excelExportWorksheetName);
  }

  apiExport = () =>
    dataTableFetch(
      (spe) => this.setState({ speExport: spe }),
      this.props.url,
      stateToRequestBody({
        columnDefs: this.props.columnDefs,
        perColumnFilters: this.props.perColumnFilters,
        order: this.props.order,
        pageSize: 1000000
      })
    )
      .then(({ data }) =>
        this.convertToExcel(data)
      )

  render = () =>
    <Loading className="loading-for-toolbar-export" spe={this.state.speExport}>
      <button type="button" className="button toolbar-export" onClick={this.apiExport}>
        EXPORT
        <i className="fa fa-download"/>
      </button>
    </Loading>
}

export default ExportButton;
