import React, { PureComponent } from 'react';
import {PieChart, Pie, Label, Legend, Cell} from 'recharts';


const data01 = [{name: 'Temperature', value: 47}, {name: '', value: 23}];
const data02 = [{name: 'background', value: 70}];
const data03 = [
  {name: 'A1', value: 10},
  {name: 'A2', value: 10},
  {name: 'A3', value: 10},
  {name: 'A4', value: 10},
  {name: 'A5', value: 10},
  {name: 'A6', value: 10},
  {name: 'A7', value: 10},
];

class RechartsGauge extends PureComponent {

  render() {
    return (
      <PieChart width={800} height={400} style={{fontFamily: 'sans-serif'}}>
        <Pie data={data02} label={false} startAngle={180} endAngle={0} cx={200} cy={200} innerRadius={40} outerRadius={60} fill="#eeeeff"/>
        <Pie data={data03} label={false} startAngle={180} endAngle={0} cx={200} cy={200} innerRadius={60} outerRadius={65} fill="#444444" />
        <Pie data={data01} startAngle={180} endAngle={0} cx={200} cy={200} innerRadius={40} outerRadius={60} fill="#f44336">
          {
            data01.map((entry, index) => <Cell fill={index ? '#eeeeff' : '#f44336'}/>)
          }
          <Label value="77.5°F" position="center" />
        </Pie>
      </PieChart>
    );
  }
}

export default RechartsGauge;
