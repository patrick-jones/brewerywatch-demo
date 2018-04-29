// import React, { PureComponent } from 'react';
// import PT from 'prop-types';
//
// import { VictoryArea, VictoryCursorContainer, VictoryGroup, VictoryTheme } from 'victory';
//
// import {TemperatureReading} from '../fb/dataShapes';
//
//
// const dateFormatter = new Intl.DateTimeFormat('en-US', {
//   month: 'numeric',
//   day: 'numeric',
//   hour: 'numeric',
//   minute: '2-digit',
// });
//
//
// const cursorContainer = (
//   <VictoryCursorContainer
//     cursorDimension="x"
//     cursorLabel={d => {`${dateFormatter.format(d.x)} : ${d.y}`}}
//   />
// );
//
//
// class MiniTimelineChart extends PureComponent {
//
//   static propTypes = {
//     readings: PT.arrayOf(PT.shape(TemperatureReading)),
//   };
//
//   static defaultProps = {
//     readings: [],
//   };
//
//   static chartStyle = {
//     data: { fill: 'url(#colorTmp)' }
//   };
//
//
//   render() {
//     const {readings} = this.props;
//     return (
//       <React.Fragment>
//         <svg style={{ height: 0 }}>
//           <defs>
//             <defs>
//               <linearGradient id="colorTmp" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#4B6D7B" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#4B6D7B" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
//           </defs>
//         </svg>
//         <VictoryGroup scale={{x: 'time'}} theme={VictoryTheme.material}>
//           <VictoryArea
//             data={readings}
//             style={MiniTimelineChart.chartStyle}
//             interpolation='monotoneX'
//             x='ts'
//             y='degf'
//             containerComponent={cursorContainer}
//           />
//         </VictoryGroup>
//       </React.Fragment>
//     );
//   }
// }
//
// export default MiniTimelineChart;
