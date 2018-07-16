const injectColumnDefWithDefaultProps = (columnDef) => ({
  data: false,
  orderable: true,
  exportable: true,
  search: false,
  render: false,
  ...columnDef
});

export default injectColumnDefWithDefaultProps;
