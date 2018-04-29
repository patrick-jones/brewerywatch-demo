import React from 'react';
import PT from 'prop-types';

class Passthrough extends React.Component {

  static propTypes = {
    children: PT.element.isRequired,
  };

  render() {
    const {children, ...rest} = this.props;
    const child = React.Children.only(children);
    return React.cloneElement(child, rest);
  }
}

export default Passthrough;
