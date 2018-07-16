const getInitialPerColumnFilters = (columnDefs) =>
  columnDefs
    .filter((columnDef) => columnDef.search)
    .map((columnDef) => {
      switch (columnDef.search.type) {
        case 'text': return {
          data: columnDef.data,
          filter: columnDef.search.default || ''
        };
        case 'calendar': return {
          data: columnDef.data,
          filter: columnDef.search.default || {
            from: null,
            to: null
          }
        };
        case 'select': return {
          data: columnDef.data,
          filter: columnDef.search.default || ''
        };
        default:
          throw new Error(`columnDef.search.type can't be '${columnDef.search.type}'`);
      }
    });

export default getInitialPerColumnFilters;
