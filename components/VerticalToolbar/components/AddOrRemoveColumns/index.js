import React from 'react';

class AddOrRemoveColumns extends React.Component {
  static propTypes = {
    // columnDefs: PropTypes.array.isRequired
  }

  state = {
    isOpen: false
  }

  toggle = () =>
    this.setState({ isOpen: !this.state.isOpen })

  render = () =>
    <section className="add-or-remove-columns">
      {
        this.state.isOpen &&
        <form>
          <h1>Hello rrr</h1>
        </form>
      }

      <div className="toggler" onClick={this.toggle}>
        <i className="fa fa-list"/>
      </div>
    </section>
}

export default AddOrRemoveColumns;
