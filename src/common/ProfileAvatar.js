import React from 'react';
import { Avatar } from 'react-md';

import defaultUser from '../assets/user.svg';

/**
 *
 * @param profile
 * @return {*}
 */
export default ({profile, large, className}) => {
  const classes = (large ? 'md-avatar--large ' : '') + (className || '');
  if (profile && profile.photoURL) {
    return (
      <Avatar src={profile.photoURL} className={classes} />
    );
  } else if (profile && profile.displayName) {
    return (
      <Avatar className={className}>{profile.displayName.charAt(0)}</Avatar>
    );
  }
  return (<Avatar src={defaultUser} className={className} />);
};
