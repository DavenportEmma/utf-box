import React from 'react';
import './Table.css'

class Cell extends React.Component {
  render() {
    return (
      <span className='cell' 
            onClick={this.props.onClick}>{this.props.value}
      </span>
    )
  }
}

export default class Table extends React.Component {
  renderCell(i, j) {
      return <Cell key={j} value={this.props.cells[i][j]} onClick={() => this.props.onClick(i, j)}/>
  }

  renderRow(i) {
    const cols = [];
    for (let j = 0; j < this.props.colNum; j++) {
      cols.push(this.renderCell(i, j));
    }
    return cols;
  }

  renderTable() {
    const rows = [];
    for (let i = 0; i < this.props.rowNum; i++) {
      rows.push(<div key={i} className='row'>{this.renderRow(i)}</div>)
    }
    return rows;
  }

  render() {
    return (
      <div className='table'>
        {this.renderTable()}
      </div>
    )
  }
}