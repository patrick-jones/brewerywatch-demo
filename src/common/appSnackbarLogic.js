import {kea} from 'kea';
import PT from 'prop-types';


const DEFAULT_OPTIONS = {
  autohide: true,
  autohideTimeout: 3000,
};


export default kea({
  path: () => ['kea', 'snackbar'],
  actions: () => ({
    addToast: (text, action, options={}) => {
      return {toast: {text, action, options: {...DEFAULT_OPTIONS, ...options}}};
    },
    dismissToast: true,
  }),

  reducers: ({actions}) => ({
    toasts: [[], PT.array, {
      [actions.addToast]: (state, {toast}) => [...state, toast],
      [actions.dismissToast]: (state) => {
        const sliced = state.slice(1);
        console.log(sliced);
        return sliced;
      },
    }],
  }),
});

export {
  DEFAULT_OPTIONS,
}