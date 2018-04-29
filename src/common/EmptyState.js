import React, { PureComponent } from 'react';
import PT from 'prop-types';

import foreverAlone from '../assets/ForeverAlone.png';

import './EmptyState.scss';


class EmptyState extends PureComponent {

  static propTypes = {
    title: PT.string.isRequired,
    message: PT.node.isRequired,
    image: PT.string,
    className: PT.string,
  };

  static defaultProps = {
    image: foreverAlone,
    className: '',
  };

  render() {
    const {title, message, image, className} = this.props;

    return (
      <div className={`empty-state ${className}`}>
        <div>
          <h1>{title}</h1>
          <img src={image} alt='so lonely' title='so lonely'/>
          <p>
            {message}
          </p>
        </div>
      </div>
    );
  }
}

export default EmptyState;
