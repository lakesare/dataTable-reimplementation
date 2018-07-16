import React from 'react';
import PropTypes from 'prop-types';

import css from './index.scss';

class Pagination extends React.Component {
  static propTypes = {
    recordsTotal: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    updateCurrentPage: PropTypes.func.isRequired,
  }

  updateCurrentPage = (pageN) => {
    if (this.props.currentPage !== pageN) {
      this.props.updateCurrentPage(pageN);
    }
  }

  pagesToDisplay = (currentPage, amountOfPages) =>
    [
      1,
      currentPage - 3,
      currentPage - 2,
      currentPage - 1,

      currentPage,

      currentPage + 1,
      currentPage + 2,
      currentPage + 3,
      amountOfPages
    ]
      // filter out negatives and exceeding max page amount
      .filter((pageN) =>
        pageN <= amountOfPages &&
        pageN >= 1
      )
      // uniq
      .filter((pageN, index, array) => array.indexOf(pageN) === index);

  renderPage = (pageN) =>
    <li
      key={pageN}
      className={pageN === this.props.currentPage ? 'page-n current' : 'page-n'}
      onClick={() => this.updateCurrentPage(pageN)}
    >{pageN}</li>

  renderArrow = (ifClickable, nextPage, iconClass) =>
    <li
      key={iconClass}
      className={`arrow ${ifClickable ? 'active' : 'disabled'}`}
      onClick={ifClickable ? () => this.updateCurrentPage(nextPage) : () => {}}
    ><i className={`fa ${iconClass}`}/></li>

  render = () => {
    const currentPage = this.props.currentPage;
    const amountOfPages = Math.ceil(this.props.recordsTotal / this.props.pageSize);

    const pageLinks = [];
    let prevN = 0;

    // [1,   10, 11, 12,   100]
    this.pagesToDisplay(currentPage, amountOfPages).forEach((pageN) => {
      const ifPageIsConsecutive = prevN + 1 === pageN;
      if (!ifPageIsConsecutive) {
        pageLinks.push(<li key={`epsilon before-${pageN}`}>...</li>);
      }
      pageLinks.push(this.renderPage(pageN));
      prevN = pageN;
    });

    return <section className={`pagination ${css.pagination}`}>
      <ul>
        {this.renderArrow(currentPage > 1, currentPage - 1, 'fa-chevron-left')}
        {pageLinks}
        {this.renderArrow(currentPage < amountOfPages, currentPage + 1, 'fa-chevron-right')}
      </ul>
    </section>;
  }
}

export default Pagination;
