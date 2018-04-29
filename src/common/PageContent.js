import React from 'react';
import {Grid} from 'react-md';

import './PageContent.scss';

class PageContent extends React.Component {

  render() {
    return (
      <section className={'page-content ' + (this.props.className || '')}>
        {this.props.children}
      </section>
    );
  }
}

export default PageContent;
