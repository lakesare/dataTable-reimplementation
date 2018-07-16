import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import getInitialPerColumnFilters from './services/getInitialPerColumnFilters';
import columnDefPropType          from './services/columnDefPropType';

import Pagination        from './components/Pagination';
import PerColumnFilter   from './components/PerColumnFilter';
import OrderIconAndTitle from './components/OrderIconAndTitle';
import Tr from './components/Tr';
import Toolbar from './components/Toolbar';
// import VerticalToolbar from './components/VerticalToolbar';

import css from './index.scss';

class DataTable extends React.Component {
  static propTypes = {
    // from DTW
    url: PropTypes.string.isRequired,
    columnDefs: PropTypes.arrayOf(columnDefPropType).isRequired,
    pageSize: PropTypes.number.isRequired,
    apiSearch: PropTypes.func.isRequired,
    // all state for this components is kept at DataTableWrapper
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,

    // from <DataTable props/>
    fromApiToHuman: orFalse(PropTypes.func),
    toolbarInsides: orFalse(PropTypes.element),
    renderWhenClickedOnRow: orFalse(PropTypes.func),
    renderAction: orFalse(PropTypes.func),
    excelExportFileName: PropTypes.string,
    excelExportWorksheetName: PropTypes.string
  }

  static defaultProps = {
    fromApiToHuman: false,
    toolbarInsides: false,
    renderWhenClickedOnRow: false,
    renderAction: false,
    excelExportFileName: 'world_central.xlsx',
    excelExportWorksheetName: 'World Central Table Export'
  }

  componentDidMount() { this.props.apiSearch(); }

  updateOrder = (order) => {
    this.props.setState({ order, currentPage: 1 }, this.props.apiSearch);
  }

  updateCurrentPage = (currentPage) => {
    this.props.setState({ currentPage }, this.props.apiSearch);
  }

  updatePerColumnFilters = (perColumnFilters, callback) => {
    this.props.setState({ perColumnFilters, currentPage: 1 }, callback);
  }

  clearAllPerColumnFilters = () =>
    this.updatePerColumnFilters(
      getInitialPerColumnFilters(this.props.columnDefs),
      this.props.apiSearch
    )

  renderWhenHavePayload = (render) =>
    this.props.state.speRows.payload &&
    render(this.props.state.speRows.payload)

  renderPagination = () =>
    this.renderWhenHavePayload(({ recordsTotal }) =>
      <Pagination
        recordsTotal={recordsTotal}
        currentPage={this.props.state.currentPage}
        updateCurrentPage={this.updateCurrentPage}
        pageSize={this.props.pageSize}
      />
    )

  renderLoadingIcon = () =>
    this.props.state.speRows.status === 'request' &&
    <div className="loading">
      <i className="fa fa-circle-o-notch fa-spin fa-2x fa-fw"/>
    </div>

  renderTable = () =>
    <table className="standard-table">
      <thead>
        <tr className="titles">
          {this.props.columnDefs.map((columnDef, index) =>
            <th key={index} className={columnDef.data}>
              <OrderIconAndTitle
                index={index}
                title={columnDef.title}
                orderable={columnDef.orderable}
                order={this.props.state.order}
                updateOrder={this.updateOrder}
              />
            </th>
          )}
          <th className="action"/>
        </tr>
        <tr className="filters">
          {this.props.columnDefs.map((columnDef, index) =>
            <th key={index}>
              <PerColumnFilter
                columnDef={columnDef}
                perColumnFilters={this.props.state.perColumnFilters}
                updatePerColumnFilters={this.updatePerColumnFilters}
                apiSearch={this.props.apiSearch}
              />
            </th>
          )}
          <th className="action">
            <button
              className="button red"
              onClick={this.clearAllPerColumnFilters}
              type="button"
            >Clear All</button>
          </th>
        </tr>
      </thead>

      {this.renderWhenHavePayload(({ data }) =>
        <tbody>
          {
            data.length > 0 ?
            data.map((tr, index) =>
              <Tr
                key={index}
                tr={tr}
                columnDefs={this.props.columnDefs}
                fromApiToHuman={this.props.fromApiToHuman}
                renderWhenClickedOnRow={this.props.renderWhenClickedOnRow}
                renderAction={this.props.renderAction}
              />
            ) :
            <tr>
              <td colSpan={this.props.columnDefs.length + 1}>No records found.</td>
            </tr>
          }
        </tbody>
      )}

      {
        this.props.state.speRows.status === 'failure' &&
        <tbody>
          <tr>
            <td colSpan={this.props.columnDefs.length + 1}>{this.props.state.speRows.error}</td>
          </tr>
        </tbody>
      }
    </table>

  renderToolbar = () =>
    <Toolbar
      url={this.props.url}
      columnDefs={this.props.columnDefs}
      fromApiToHuman={this.props.fromApiToHuman}
      perColumnFilters={this.props.state.perColumnFilters}
      order={this.props.state.order}
      toolbarInsides={this.props.toolbarInsides}
      excelExportFileName={this.props.excelExportFileName}
      excelExportWorksheetName={this.props.excelExportWorksheetName}
    />

  // renderVerticalToolbar = () =>
  //   <VerticalToolbar
  //     url={this.props.url}
  //     columnDefs={this.props.columnDefs}
  //     fromApiToHuman={this.props.fromApiToHuman}
  //     perColumnFilters={this.props.state.perColumnFilters}
  //     order={this.props.state.order}
  //   />

  render = () =>
    <div className="background blue">
      <div className={'container ' + css.container}>
        {this.renderToolbar()}

        <section className="dataTable-wrapper">
          {this.renderTable()}
          {this.renderLoadingIcon()}
        </section>

        {this.renderPagination()}
      </div>
    </div>
}

export default DataTable;

// for comfortable import DataTable, { DataTableWrapper }
import DataTableWrapper from './DataTableWrapper';
export { DataTableWrapper };
