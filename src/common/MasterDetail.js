import React, { Component } from 'react';
import PT from 'prop-types';

import './MasterDetail.scss';


const classNames = (base, showDetail, passthrough='') => {
  return showDetail ? `${base} ${base}--detail ${passthrough}` : `${base} ${passthrough}`;
};


class MasterDetail extends Component {
  static propTypes = {
    showDetail: PT.bool,
    forceDetail: PT.bool,
    master: PT.func.isRequired,
    detail: PT.func.isRequired,

    wrapperClass: PT.string,
    masterClass: PT.string,
    detailClass: PT.string,
  };

  static defaultProps = {
    showDetail: false,
    forceDetail: false,
    wrapperClass: '',
    masterClass: '',
    detailClass: '',
  };

  render() {
    const {showDetail, forceDetail, master, detail, wrapperClass, masterClass, detailClass} = this.props;

    return (
      <div className={classNames('master-detail', showDetail, wrapperClass)}>
        <div className={classNames('master-detail__master', showDetail, masterClass)}>
          {master({showDetail})}
        </div>
        {(showDetail || forceDetail) && <div className={classNames('master-detail__detail', showDetail, detailClass)}>
          {detail({showDetail})}
        </div>}
      </div>
    );
  }
}


// const ShowProps = {
//   showDetail: PT.bool,
// };
//
//
// const classNames = (base, showDetail, passthrough='') => {
//   return showDetail ? `${base} ${base}--detail ${passthrough}` : `${base} ${passthrough}`;
// };
//
//
// class MasterDetail extends Component {
//
//   static propTypes = ShowProps;
//
//   static defaultProps = {
//     showDetail: false,
//   };
//
//   render() {
//     const {showDetail, classNames, ...rest} = this.props;
//     return (
//       <div className={classNames('master-detail', showDetail, classNames)} {...rest}>
//         {this.props.children}
//       </div>
//     );
//   }
//
// }
//
//
// class Master extends Component {
//
//   static contextTypes = ShowProps;
//
//   static defaultProps = {
//     showDetail: false,
//   };
//
//   render() {
//     const {showDetail, ...rest} = this.props;
//     return (
//       <div
//         className={classNames('master-detail__master', showDetail)}
//         {...rest}
//       >
//         {this.props.children}
//       </div>
//     );
//   }
// }
//
//
// class Detail extends Component {
//
//   static contextTypes = ShowProps;
//
//   static defaultProps = {
//     showDetail: false,
//   };
//
//   render() {
//     const {showDetail, ...rest} = this.props;
//     if (showDetail) {
//       return (
//         <div
//           className={classNames('master-detail__detail', showDetail)}
//           {...rest}
//         >
//           {this.props.children}
//         </div>
//       );
//     }
//
//     return null;
//   }
// }
//
//
//
// MasterDetail.Master = Master;
// MasterDetail.Detail = Detail;
//
export default MasterDetail;
