import React from 'react';
import './Table.css'

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      colour: 'black',
      value: ''
    }
  }

  mouseOverHandler() {
    
  }

  mouseOutHandler() {

  }

  clickHandler() {
    
  }

  render() {
    return (
      <span 
        className='cell'
        onMouseOver={() => this.mouseOverHandler()}
        onMouseOut={() => this.mouseOutHandler()}
        onClick={() => this.clickHandler()}
      >
        {this.state.value}
      </span>
    )
  }
}

export default class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  renderCell(i) {
    return <Cell key={i}/>
  }

  renderRow(n) {
    const cols = [];
    for (let i = 0; i < n; i++) {
      cols.push(this.renderCell(i));
    }
    return cols;
  }

  renderTable(rn, cn) {
    const rows = [];
    for (let i = 0; i < rn; i++) {
      rows.push(<div key={i} className='row'>{this.renderRow(cn)}</div>)
    }
    return rows;
  }
  render() {
    const colNum = 50;
    const rowNum = 25;

    return (
      <div 
        className='table'
      >
        {this.renderTable(rowNum, colNum)}
      </div>
    )
  }
}