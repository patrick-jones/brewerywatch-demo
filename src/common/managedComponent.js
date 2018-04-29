import React from 'react';
import PT from 'prop-types';
import {kea} from 'kea';


class Kea extends React.Component {
  static propTypes = {
    children: PT.element.isRequired,
  };

  render() {
    const {children, ...rest} = this.props;
    const child = React.Children.only(children);
    return React.cloneElement(child, rest);
  }
}

export default function managedComponent(keaOptions) {
  class Managed extends Kea {}
  return kea(keaOptions)(Managed);
}

