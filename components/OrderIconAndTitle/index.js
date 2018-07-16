import React from 'react';
import PropTypes from 'prop-types';

import css from './index.scss';

class OrderIconAndTitle extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    orderable: PropTypes.bool.isRequired,

    order: PropTypes.shape({
      direction: PropTypes.oneOf(['asc', 'desc']),
      column: PropTypes.number
    }).isRequired,
    updateOrder: PropTypes.func.isRequired
  }

  updateOrder = () => {
    if (!this.props.orderable) return;

    let direction;
    if (this.ifSortedByThisColumn()) {
      direction = this.props.order.direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'asc';
    }

    this.props.updateOrder({
      direction, column: this.props.index
    });
  }

  ifSortedByThisColumn = () =>
    this.props.order.column === this.props.index

  renderOrderIcon = () => {
    if (this.ifSortedByThisColumn() && this.props.order.direction === 'asc') {
      return <i className="fa fa-sort-asc"/>;
    } else if (this.ifSortedByThisColumn() && this.props.order.direction === 'desc') {
      return <i className="fa fa-sort-desc"/>;
    } else if (!this.ifSortedByThisColumn()) {
      return <i className="fa fa-sort"/>;
    }
  }

  render = () =>
    <section
      className={`
        order-icon_and_title
        ${css['order-icon_and_title']}
        ${this.props.orderable ? 'sortable' : 'nonsortable'}
      `}
      onClick={this.updateOrder}
    >
      {
        this.props.orderable &&
        this.renderOrderIcon()
      }
      <span className="title">{this.props.title}</span>
    </section>
}

export default OrderIconAndTitle;
