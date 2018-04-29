import React, { PureComponent } from 'react';
import PT from 'prop-types';
import { Button, SnackbarContainer as Snackbar } from 'react-md';

import snackbarLogic, {DEFAULT_OPTIONS} from './appSnackbarLogic';


class AppSnackbarComponent extends PureComponent {

  static propTypes = {
    toasts: PT.array, // from kea
  };

  static defaultProps = {
    toasts: [],
  };

  render() {
    const {toasts, actions: {dismissToast}} = this.props;
    const options = toasts.length ? toasts[0].options : DEFAULT_OPTIONS;
    const stripped = toasts.map(t => {
      const {text, action, ...rest} = t;
      return {text, action};
    });
    return (
      <Snackbar
        id='application-snackbar'
        toasts={stripped}
        onDismiss={dismissToast}
        {...options}
      />
    );
  }
}

export default snackbarLogic(AppSnackbarComponent);

export {
  AppSnackbarComponent,
}
