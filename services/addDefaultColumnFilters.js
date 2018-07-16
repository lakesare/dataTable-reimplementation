const addDefaultColumnFilters = (columnDefs, defaultColumnFilters) =>
  columnDefs.map((columnDef) => {
    // all datas from our defaultColumnFilters props.
    // columnDefs with this datas have a default value.
    // => ['firstName', 'requestDate']
    const datasWhoHaveDefaultFilters = Object.keys(defaultColumnFilters);

    const ifThisColumnDefHasDefaultFilter = datasWhoHaveDefaultFilters.find((data) => data === columnDef.data);

    if (ifThisColumnDefHasDefaultFilter) {
      const defaultFilter = defaultColumnFilters[columnDef.data];
      return {
        ...columnDef,
        search: {
          ...columnDef.search,
          default: defaultFilter
        }
      };
    } else {
      return columnDef;
    }
  });

export default addDefaultColumnFilters;
