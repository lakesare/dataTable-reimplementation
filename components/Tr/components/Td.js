import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

class Td extends React.Component {
  static propTypes = {
    columnDef: PropTypes.object.isRequired,
    tr: PropTypes.object.isRequired,
    humanizedTr: orFalse(PropTypes.object).isRequired
  }

  render = () => {
    const { columnDef, tr, humanizedTr } = this.props;
    // if function render is defined per column
    if (columnDef.render) {
      return columnDef.render(tr);
    // if fromApiToHuman is defined per table,
    // and humanizedTr.human['address'] exists
    } else if (humanizedTr && humanizedTr.human[columnDef.data]) {
      return <td className={columnDef.data}>
        {humanizedTr.human[columnDef.data]}
      </td>;
    // default case, just render an api value corresponding to column's :data
    } else {
      const value = tr[columnDef.data];
      // false and null values won't get displayed
      return <td className={columnDef.data}>{value}</td>;
    }
  }
}

export default Td;
