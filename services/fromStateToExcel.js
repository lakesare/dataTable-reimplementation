// (arrayOfRecords) => [{ status: 1 }, ...]
// => [{ 'Status': 'pending', ... }]
const fromStateToExcel = (arrayOfRecords, fromApiToHuman, columnDefs) =>
  // for each record, e.g. passenger
  arrayOfRecords.map((recordFromApi) => { // { status: 1, ... }
    const humanizedRecordFromApi = fromApiToHuman ? fromApiToHuman(recordFromApi) : false;
    const hash = {};
    columnDefs
      .filter((columnDef) => columnDef.exportable)
      .forEach((columnDef) => {
        let value;
        // if function renderForExcel is defined per column
        if (columnDef.renderForExcel) {
          value = columnDef.renderForExcel(recordFromApi);
        // if fromApiToHuman is defined per table,
        // and humanizedTr.human['address'] exists
        } else if (humanizedRecordFromApi && humanizedRecordFromApi.human[columnDef.data]) {
          value = humanizedRecordFromApi.human[columnDef.data];
        // default case, just render an api value corresponding to column's :data
        } else {
          value = recordFromApi[columnDef.data];
        }

        hash[columnDef.title] = value;
      });

    return hash;
  });

export default fromStateToExcel;
