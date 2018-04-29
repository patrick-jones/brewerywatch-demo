import React, { PureComponent } from 'react';
import PT from 'prop-types';
import {CircularProgress, DialogContainer} from 'react-md';


class WholePageBusy extends PureComponent {

  static propTypes = {
    showSpinner: PT.bool.isRequired,
    title: PT.string,
    message: PT.string,
  };

  static defaultProps = {
    showSpinner: true,
  };

  render() {
    const {title, message, showSpinner} = this.props;
    return (
      <DialogContainer
        id='whole-page-busy'
        modal
        visible
        focusOnMount={false}
        aria-busy
        aria-describedby='whole-page-busy-message'
        title={title}
      >
        <div
          className="whole-page-busy-content md-color--secondary-text md-dialog-content md-dialog-content--padded"
        >
          {showSpinner && <CircularProgress id='whole-page-busy-progress' centered={false} className='whole-page-busy-content__spinner' />}
          <p id='whole-page-busy-message' className='whole-page-busy-content__message'>
            {message}
          </p>
        </div>
      </DialogContainer>
    );
  }
}

export default WholePageBusy;
