import React from 'react';
import _ from 'lodash';

import getInitialPerColumnFilters from './services/getInitialPerColumnFilters';
import dataTableFetch             from '~/api/services/dataTableFetch';
import stateToRequestBody         from './services/stateToRequestBody';
import addDefaultColumnFilters    from './services/addDefaultColumnFilters';
import injectColumnDefWithDefaultProps from './services/injectColumnDefWithDefaultProps';

const statusify = (row, status) => ({
  ...row,
  _dataTableStatus: status
});

// ___How to make DataTable aware of new/updated/deleted rows?
//   1. keep all records in Main
//     we would have to keep all the things in every Main then.
//   2. keep changes in Main
//     state = { changes: [
//       2: { payload: {}, status: 'created' }
//     ] }
//     when something gets created or updated, DataTable.changes state updates.
//   3. keep state in HOC, and wrap every Main with DataTable in it! (chose this)
const DataTableWrapper = (url, customColumnDefs, {
    initialState: {
      // unlike other options.initialState - this can be a partial object, e.g.:
      // {
      //   status: 'P',
      //   requestDate: {
      //     from: null,
      //     to: moment().utc()
      //   }
      // }
      // I made this decision because otherwise adding default column filters would require DataWrapper user to use:
      // this.props.DataTableWrapper.columnDefs and import 'getInitialPerColumnFilters' every time they want to inject some default props.
      columnFilters = {},
      currentPage = 1,
      order = {
        column: 0,
        direction: 'asc'
      },
      toolbarSearchString = '',
    } = {}, // optional intialState object
    pageSize = 20
  } = {} // optional options object
) => (Child) => {
  const columnDefs = customColumnDefs.map(injectColumnDefWithDefaultProps);
  return class extends React.Component {
    state = {
      perColumnFilters: getInitialPerColumnFilters(
        addDefaultColumnFilters(columnDefs, columnFilters)
      ),
      currentPage,
      order,
      toolbarSearchString,

      speRows: {}
    }

    apiSearch = () => {
      dataTableFetch(
        (spe) => {
          if (spe.status === 'request') {
            this.setState({ speRows: { ...this.state.speRows, status: 'request' } });
          } else {
            this.setState({ speRows: spe });
          }
        },
        url,
        stateToRequestBody({
          pageSize,
          columnDefs,
          perColumnFilters: this.state.perColumnFilters,
          currentPage: this.state.currentPage,
          order: this.state.order,
          toolbarSearchString: this.state.toolbarSearchString
        })
      );
    }

    apiGetById = (id, onSuccess) =>
      dataTableFetch(
        false,
        url + `?id=${id}`,
        stateToRequestBody({
          columnDefs,
          // when backend makes search filters optional, we can just put [] here
          perColumnFilters: getInitialPerColumnFilters(columnDefs),
          currentPage: 1,
          pageSize: 1,
          order: this.state.order,
          toolbarSearchString: '',
          id
        })
      )
        .then((response) => onSuccess(response.data[0]))

    uiCreate = (returnedRow) =>
      this.apiGetById(
        returnedRow.id,
        (createdRow) => this.setState({
          speRows:
          _.update(this.state.speRows, 'payload.data',
            (rows) => [statusify(createdRow, 'created'), ...rows]
          )
        })
      )

    uiUpdate = (returnedRow) =>
      this.apiGetById(
        returnedRow.id,
        (updatedRow) => {
          const index = this.state.speRows.payload.data.findIndex(
            (row) => row.id === updatedRow.id
          );

          this.setState({
            speRows:
            _.update(this.state.speRows, `payload.data[${index}]`, () => statusify(updatedRow, 'updated'))
          });
        }
      )

    uiDelete = (deletedRowId) => {
      const payload = this.state.speRows.payload;
      const index = payload.data.findIndex(
        (row) => row.id === deletedRowId
      );

      const deletedRow = payload.data[index];

      this.setState({
        speRows:
        _.update(this.state.speRows, `payload.data[${index}]`, () => statusify(deletedRow, 'deleted'))
      });
    }

    render = () =>
      <Child
        {...this.props} // React-router props
        DataTableWrapper={{
          state: this.state,
          setState: (newState, callback) => this.setState(newState, callback),
          url,
          columnDefs,
          pageSize,
          uiCreate: this.uiCreate,
          uiUpdate: this.uiUpdate,
          uiDelete: this.uiDelete,
          apiSearch: this.apiSearch
        }}
      />
  };
};

export default DataTableWrapper;
