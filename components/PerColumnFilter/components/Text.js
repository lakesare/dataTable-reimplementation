import React from 'react';
import PropTypes from 'prop-types';

class Text extends React.Component {
  static propTypes = {
    updateFilter: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    apiSearch: PropTypes.func.isRequired
  }

  onEnterPressed = (e) => {
    e.which === 13 &&
    this.props.apiSearch();
  }

  render = () =>
    <input
      type="text"
      placeholder="Search"
      onKeyPress={this.onEnterPressed}
      onChange={(e) => this.props.updateFilter(e.target.value)}
      value={this.props.filter}
    />
}

export default Text;
