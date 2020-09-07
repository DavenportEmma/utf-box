import React from 'react';
import Table from "./Table";
import './App.css';
import pkg from '../../package.json'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.rows = 25  // number of rows and columns in table
    this.cols = 50
    this.leftmost = this.cols - 1 // keeps track of the leftmost filled square
    this.prevLeftmost = this.leftmost.valueOf() // used to see if leftmost has changed
    // create 2d array of null cells
    this.cells = Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = Array(this.cols).fill(null);
    }

    this.textCoords = [null,null]

    this.state = {
      mouseDown: false,
      select: "none",
      tool: "draw",
      row: this.rows,
      col: this.cols,
      cells: this.cells,
      key: " "
    }
  }

  check(c) {
    if (c === null || (c.charCodeAt(0) < 128 && c.charCodeAt(0) > 31)) {
      return false
    } else {
      return true
    }
  }

  checkForLimits(c) {
    if (c === null || c === " ") {
      return false
    } else {
      return true
    }
  }
  // newCell = false when adjacent cells are being updated
  updateCell(i, j, newCell, tool) {
    let newState = Object.assign({}, this.state);
    let n = newState.cells;
    // don't update oob cells
    if (i <= 0 || j <= 0 || i >= this.rows - 1 || j >= this.cols - 1) {
      return;
    }

    // don't update empty adjacent cells
    if (newCell === false && !this.check(n[i][j])) {
      return;
    }
    // get adjacent cells
    let A = n[i-1][j];
    let B = n[i][j+1];
    let C = n[i+1][j];
    let D = n[i][j-1];
    let ans = null;
    //━ ┃ ┏ ┓ ┗ ┛ ┣ ┫ ┳ ┻ ╋
    // fill cell with line character based on the adjacent cells
    if (tool === "draw") {
      if ((this.check(A) || this.check(C)) && !this.check(B) && !this.check(D)) {
        ans = '┃';
      } else if (!this.check(A) && !this.check(C) && (this.check(B) || this.check(D))) {
        ans = '━';
      } else if (!this.check(A) && this.check(B) && this.check(C) && !this.check(D)) {
        ans = '┏';
      } else if (!this.check(A) && !this.check(B) && this.check(C) && this.check(D)) {
        ans = '┓';
      } else if (this.check(A) && this.check(B) && !this.check(C) && !this.check(D)) {
        ans = '┗';
      } else if (this.check(A) && !this.check(B) && !this.check(C) && this.check(D)) {
        ans = '┛';
      } else if (this.check(A) && this.check(B) && this.check(C) && !this.check(D)) {
        ans = '┣';
      } else if (this.check(A) && !this.check(B) && this.check(C) && this.check(D)) {
        ans = '┫';
      } else if (!this.check(A) && this.check(B) && this.check(C) && this.check(D)) {
        ans = '┳';
      } else if (this.check(A) && this.check(B) && !this.check(C) && this.check(D)) {
        ans = '┻';
      } else if (this.check(A) && this.check(B) && this.check(C) && this.check(D)) {
        ans = '╋';
      } else {
        ans = '╸'
      }
    } else if (tool === "erase") {
      if (j < this.leftmost) {
        ans = null
      } else {
        ans = " "
      }
    }

    n[i][j] = ans;

    // check for leftmost cell updates
    if(tool === "erase" && newCell) {
      loop:
      for (let m = 0; m < this.cols; m++) {
        for (let k = 0; k < this.rows; k++) {
          if (this.checkForLimits(n[k][m]) || (m === this.cols - 1 && k === this.rows - 1)) {
            this.prevLeftmost = this.leftmost.valueOf()
            this.leftmost =  m
            break loop
          }
        }
      }
    }

    if(tool === "draw" && j < this.leftmost) {
      this.leftmost = j;
      // fill all the cells right of the leftmost non-empty cell to
      // improve selecting it for copy pasting
      for (let k = 0; k < this.rows; k++) {
        for (let m = this.leftmost; m < this.cols; m++) {
          if (!this.checkForLimits(n[k][m])) {
            n[k][m] = " "
          }
        }
      }
    }

    // set all cells left of leftmost to null
    if(this.prevLeftmost < this.leftmost) {
      for (let k = 0; k < this.rows; k++) {
        for (let m = 0; m < this.leftmost; m++) {
            n[k][m] = null
        }
      }
    }

    this.setState({cells: n});
  }

  handleKeyPress(e) {
    let char = String.fromCharCode(e.keyCode);
    //this.setState({key: String.fromCharCode(e.keyCode)})
    let newState = Object.assign({}, this.state);
    let n = newState.cells;
    n[0,0] = char;
    this.setState({cells: n});
  }

  handleClick(i, j) {
    // do nothing if select tool is selected
    if (this.state.tool === "select") {
      return;
    } else if (this.state.tool === "draw" || this.state.tool === "erase") {
      this.updateCell(i, j, true, this.state.tool);
      this.updateCell(i-1, j, false, "draw");
      this.updateCell(i+1, j, false, "draw");
      this.updateCell(i, j-1, false, "draw");
      this.updateCell(i, j+1, false, "draw");
    } else if (this.state.tool === "text") {
      
    }
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
        n[i][j] = null;
        this.setState({cells: n})
      }
    }
  }

  render() {
    return (
      <div className="component-App"
           tabIndex='0'
           style={{userSelect: this.state.select}}
           onMouseUp={() => {this.setState({mouseDown: false})}}
           onMouseDown={() => {this.setState({mouseDown: true})}}
           onKeyDown={(e) => this.handleKeyPress(e)}
      >
        <div className="version-info">v{pkg.version}</div>
        <Table 
          tabIndex='0'
          colNum={this.state.col} 
          rowNum={this.state.row}
          cells={this.state.cells}
          onClick={(i, j) => this.handleClick(i, j)}
          onMouseEnter={(i, j) => this.handleMouseEnter(i, j)}
        />
        <button onClick={() => {this.setState({tool: "draw", select: "none"})}}>Draw</button>
        <button onClick={() => {this.setState({tool: "erase", select: "none"})}}>Erase</button>
        <button onClick={() => {this.setState({tool: "select", select: "auto"})}}>Select</button>
        <button onClick={() => {this.reset()}}>Reset</button>
        <button onClick={() => {this.setState({tool: "text", select: "none"})}}>Text</button>
        
        <div style={{color:'white'}}>{this.state.key}</div>
      </div>
    )
  }
}