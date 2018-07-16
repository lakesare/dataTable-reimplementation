import React from 'react';
import PropTypes from 'prop-types';
import orFalse from '~/services/orFalse';

import Td from './components/Td';

class Tr extends React.Component {
  static propTypes = {
    tr: PropTypes.object.isRequired,
    columnDefs: PropTypes.array.isRequired,
    fromApiToHuman: orFalse(PropTypes.func).isRequired,
    renderWhenClickedOnRow: orFalse(PropTypes.func).isRequired,
    renderAction: orFalse(PropTypes.func).isRequired
  }

  ifRowIsDeleted = () =>
    this.props.tr._dataTableStatus === 'deleted'

  ifRowIsClickable = () =>
    this.props.renderWhenClickedOnRow &&
    !this.ifRowIsDeleted()

  ifActionCanBeRendered = () =>
    this.props.renderAction &&
    !this.ifRowIsDeleted()

  renderDataTds = (tr, humanizedTr) =>
    this.props.columnDefs.map((columnDef, tdIndex) =>
      <Td key={tdIndex} {...{ tr, humanizedTr, columnDef }}/>
    )

  renderActionTd = (tr) => (
    this.ifActionCanBeRendered() ?
      <td className="action" onClick={(e) => e.stopPropagation()}>
        {this.props.renderAction(tr)}
      </td> :
      <td/>
  )

  renderTr = () => {
    const tr = this.props.tr;
    const humanizedTr = this.props.fromApiToHuman && this.props.fromApiToHuman(tr);

    return <tr className={tr._dataTableStatus ? tr._dataTableStatus : ''}>
      {this.renderDataTds(tr, humanizedTr)}
      {this.renderActionTd(tr)}
    </tr>;
  }

  render = () => {
    if (this.ifRowIsClickable()) {
      return this.props.renderWhenClickedOnRow(this.renderTr(), this.props.tr);
    } else {
      return this.renderTr();
    }
  }
}

export default Tr;
