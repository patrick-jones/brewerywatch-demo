import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import foreverAlone from '../assets/ForeverAlone.png';
import './NotFound.css';

class NotFound extends PureComponent {

  render() {
    return (
      <div className='NotFound'>
        <div>
          <h1>404. That's an error.</h1>
          <img src={foreverAlone} alt='not found' title='not found'/>
          <p>
            The requested URL was not found on this server.
            Maybe try the <Link to='/'>main page</Link>.
          </p>
        </div>
      </div>
    );
  }
}

export default NotFound;
