// PropTypes.shape({
//   title: PropTypes.string.isRequired,
//   data:  PropTypes.string,
//   orderable: PropTypes.bool,
//   exportable: PropTypes.bool,
//   search: PropTypes.shape({
//     type: PropTypes.oneOf(['text', 'calendar', 'select']).isRequired,
//     possibleValues: PropTypes.object, // for type 'select',
//     // kinda TODO
//     // we don't really need this after we introduced state stored in DataTableWrapper, but let's keep it for now
//     default: PropTypes.any // if present
//   }),
//   render: PropTypes.func
// });

const columnDefPropType = (columnDefs, index, componentName) => {
  componentName = componentName || 'ANONYMOUS';
  const columnDef = columnDefs[index];

  const throwError = (fieldName, mustBeThis) => {
    throw new Error(`columnDef.${fieldName} ${mustBeThis} for columnDef.title = ${columnDef.title} (${componentName})`);
  };

  if (typeof columnDef.title !== 'string') {
    throwError('title', 'must be string');
  }

  if (columnDef.data && typeof columnDef.data !== 'string') {
    throwError('data', 'must be false or string');
  }

  // data should be mentioned: when, any of it:
  // search is present, OR when render is not present
  if (!columnDef.data && columnDef.search) {
    throwError('data', 'must be present when we want to filter by columndDef.search');
  }
  if (!columnDef.data && !columnDef.render) {
    throwError('data', "must be present when you don't provide columndDef.render instead");
  }
  // let's require renderForExcel if we're rendering this column
  if (!columnDef.data && columnDef.exportable && !columnDef.renderForExcel) {
    throwError('renderForExcel', 'must be present if columnDef is exportable, and no data is present');
  }

  if (typeof columnDef.orderable !== 'boolean') {
    throwError('orderable', 'must be true/false');
  }
  if (typeof columnDef.exportable !== 'boolean') {
    throwError('orderable', 'must be true/false');
  }

  // write validation for columndDef.search

  if (columnDef.render && typeof columnDef.render !== 'function') {
    throwError('orderable', 'must be false or function');
  }

  // assume all ok
  return null;
};

export default columnDefPropType;
