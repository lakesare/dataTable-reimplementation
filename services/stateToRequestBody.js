import hashToQueryString from '~/api/services/hashToQueryString';

const injectSearchValue = (keyValue, index, columnDefSearch, perColumnFilterFilter) => {
  switch (columnDefSearch.type) {
    case 'text':
      keyValue[`columns[${index}][search][value]`] = perColumnFilterFilter;
      break;
    case 'calendar': {
      const getDate = (fromOrTo) => {
        const momentOrNull = perColumnFilterFilter[fromOrTo];
        return momentOrNull ?
          momentOrNull.format('YYYY-MM-DD') :
          '';
      };
      keyValue[`columns[${index}][search][value]`] = getDate('from') + ':' + getDate('to');
      break;
    }
    case 'select': {
      keyValue[`columns[${index}][search][value]`] = perColumnFilterFilter || ''; // if false
      break;
    }
    default: throw new Error(`columnDef.search.type can't be '${columnDefSearch.type}'`);
  }
};

// columns[0][data]:status
// columns[0][name]:
const stateToRequestBody = ({ columnDefs, perColumnFilters, currentPage, order, pageSize, toolbarSearchString }) => {
  const keyValue = {};

  columnDefs
    // .filter((columnDef) => columnDef.search)
    .forEach((columnDef, index) => {
      keyValue[`columns[${index}][data]`] = columnDef.data;
      keyValue[`columns[${index}][orderable]`] = columnDef.orderable;
      keyValue[`columns[${index}][searchable]`] = !!columnDef.search;

      if (columnDef.search) {
        const perColumnFilter = perColumnFilters.find((pcf) => pcf.data === columnDef.data);
        injectSearchValue(keyValue, index, columnDef.search, perColumnFilter.filter);
      } else {
        keyValue[`columns[${index}][search][value]`] = '';
      }
    });

  keyValue['start'] = currentPage ? (currentPage - 1) * pageSize : '';
  keyValue['length'] = pageSize;

  keyValue['order[0][column]'] = order.column;
  keyValue['order[0][dir]'] = order.direction;

  keyValue['draw'] = '1';

  keyValue['search[value]'] = toolbarSearchString;
  keyValue['search[regex]'] = false;

  const searchParams = hashToQueryString(keyValue);
  return searchParams;
};

export default stateToRequestBody;
