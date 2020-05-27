import React from 'react';
import Table from "./Table";
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.rows = 25
    this.cols = 50
    this.cells = Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = Array(this.cols).fill(" ");
    }

    this.state = {
      mouseDown: false,
      select: "none",
      draw: "draw",
      row: this.rows,
      col: this.cols,
      cells: this.cells
    }
  }

  // newCell = false when adjacent cells are being updated
  // draw = false when erasing
  updateCell(i, j, newCell, draw) {
    if (draw === "select") {
      return;
    }
    let newState = Object.assign({}, this.state);
    let n = newState.cells;
    // don't update oob cells
    if (i <= 0 || j <= 0 || i >= this.rows - 1 || j >= this.cols - 1) {
      return;
    }

    // don't update empty adjacent cells
    if (newCell === false && n[i][j] === " ") {
      return;
    }

    let A = n[i-1][j];
    let B = n[i][j+1];
    let C = n[i+1][j];
    let D = n[i][j-1];
    let ans = null;
    //━ ┃ ┏ ┓ ┗ ┛ ┣ ┫ ┳ ┻ ╋
    if ((A !== " " || C !== " ") && B === " " && D === " ") {
      ans = '┃';
    } else if (A === " " && C === " " && (B !== " " || D !== " ")) {
      ans = '━';
    } else if (A === " " && B !== " " && C !== " " && D === " ") {
      ans = '┏';
    } else if (A === " " && B === " " && C !== " " && D !== " ") {
      ans = '┓';
    } else if (A !== " " && B !== " " && C === " " && D === " ") {
      ans = '┗';
    } else if (A !== " " && B === " " && C === " " && D !== " ") {
      ans = '┛';
    } else if (A !== " " && B !== " " && C !== " " && D === " ") {
      ans = '┣';
    } else if (A !== " " && B === " " && C !== " " && D !== " ") {
      ans = '┫';
    } else if (A === " " && B !== " " && C !== " " && D !== " ") {
      ans = '┳';
    } else if (A !== " " && B !== " " && C === " " && D !== " ") {
      ans = '┻';
    } else if (A !== " " && B !== " " && C !== " " && D !== " ") {
      ans = '╋';
    } else {
      ans = '╸'
    }

    if(draw === "erase") {
      ans = " "
    }

    n[i][j] = ans;
    this.setState({cells: n});
  }

  handleClick(i, j) {
    this.updateCell(i, j, true, this.state.draw);
    this.updateCell(i-1, j, false, "draw");
    this.updateCell(i+1, j, false, "draw");
    this.updateCell(i, j-1, false, "draw");
    this.updateCell(i, j+1, false, "draw");
  }

  handleMouseEnter(i, j) {
    if (this.state.mouseDown) {
      this.handleClick(i, j)
    }
  }

  reset() {
    let newState = Object.assign({}, this.state);
    let n = newState.cells;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        n[i][j] = " ";
        this.setState({cells: n})
      }
    }
  }

  render() {
    return (
      <div className="component-App"
           style={{userSelect: this.state.select}}
           onMouseUp={() => {this.setState({mouseDown: false})}}
           onMouseDown={() => {this.setState({mouseDown: true})}}
      >
        <Table 
          colNum={this.state.col} 
          rowNum={this.state.row}
          cells={this.state.cells}
          onClick={(i, j) => this.handleClick(i, j)}
          onMouseEnter={(i, j) => this.handleMouseEnter(i, j)}
        />
        <button onClick={() => {this.setState({draw: "draw", select: "none"})}}>Draw</button>
        <button onClick={() => {this.setState({draw: "erase", select: "none"})}}>Erase</button>
        <button onClick={() => {this.setState({draw: "select", select: "auto"})}}>Select</button>
        <button onClick={() => {this.reset()}}>Reset</button>
      </div>
    )
  }
}