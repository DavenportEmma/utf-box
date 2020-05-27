import React from 'react';
import Table from "./Table";
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.cells = Array(25);
    for (let i = 0; i < 25; i++) {
      this.cells[i] = Array(50).fill(null);
    }
    this.state = {
      row: 25,
      col: 50,
      cells: this.cells
    }
  }

  // newCell = false when adjacent cells are being updated
  updateCell(i, j, newCell) {
    let newState = Object.assign({}, this.state);
    let n = newState.cells;
    // don't update empty adjacent cells
    if (newCell === false && n[i][j] === null) {
      return;
    }

    let A = n[i-1][j];
    let B = n[i][j+1];
    let C = n[i+1][j];
    let D = n[i][j-1];
    let ans = null;
    //━ ┃ ┏ ┓ ┗ ┛ ┣ ┫ ┳ ┻ ╋
    if ((A || C) && !B && !D) {
      ans = '┃';
    } else if (!A && !C && (B || D)) {
      ans = '━';
    } else if (!A && B && C && !D) {
      ans = '┏';
    } else if (!A && !B && C && D) {
      ans = '┓';
    } else if (A && B && !C && !D) {
      ans = '┗';
    } else if (A && !B && !C && D) {
      ans = '┛';
    } else if (A && B && C && !D) {
      ans = '┣';
    } else if (A && !B && C && D) {
      ans = '┫';
    } else if (!A && B && C && D) {
      ans = '┳';
    } else if (A && B && !C && D) {
      ans = '┻';
    } else if (A && B && C && D) {
      ans = '╋';
    } else {
      ans = '╸'
    }
    n[i][j] = ans;
    this.setState({cells: n});
  }

  handleClick(i, j) {
    this.updateCell(i, j, true);
    this.updateCell(i-1, j, false);
    this.updateCell(i+1, j, false);
    this.updateCell(i, j-1, false);
    this.updateCell(i, j+1, false);
  }

  render() {
    return (
      <div className="component-App">
        <Table 
          colNum={this.state.col} 
          rowNum={this.state.row}
          cells={this.state.cells}
          onClick={(i, j) => this.handleClick(i, j)}
        />
      </div>
    )
  }
}