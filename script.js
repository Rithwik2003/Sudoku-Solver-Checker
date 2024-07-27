document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudokuGrid');
    const solveButton = document.getElementById('solveButton');
    const resetButton = document.getElementById('resetButton');
    const checkButton = document.getElementById('checkButton');
    const modeSwitch = document.getElementById('modeSwitch');

    for (let i = 0; i < 81; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.addEventListener('input', validateInput);
        sudokuGrid.appendChild(input);
    }

    modeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        let ele = document.body;
        console.log(ele.className);
        if (ele.className === "dark-mode")
            document.getElementsByClassName("mode-title")[0].innerHTML = "Switch to Light Mode";
        else
            document.getElementsByClassName("mode-title")[0].innerHTML = "Switch to Dark Mode";
    });

    solveButton.addEventListener('click', solveSudoku);
    resetButton.addEventListener('click', resetGrid);
    checkButton.addEventListener('click', checkGrid);

    function validateInput(event) {
        const value = event.target.value;
        if (!/^[1-9]$/.test(value)) {
            event.target.value = '';
        } else {
            event.target.classList.add('initial');
        }
    }

    // getting values from the user and storing in 1D array

    function getGridValues() {
        const inputs = Array.from(sudokuGrid.children);
        return inputs.map(input => input.value ? parseInt(input.value) : 0);
    }

    // Solve button functionality

    // Sudoku (Backtracking) code starts here

    function solveSudoku() {
        const grid = getGridValues();
        if(!isCorrectTillNow(grid)){
            alert('No solution exists for the given Sudoku puzzle.');
        }
        else{
            solve(grid,0,0);
            setGridValues(grid);
        }
    }

    // checking if the grid is correct till now

    function isCorrectTillNow(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = grid[row * 9 + col];
                const ret = isPossible(grid, row, col, num); // returns [true/false,wrong row,wrong col]
                if (num !== 0 && !ret[0]) {
                    if(row==ret[1])
                        alert("The Sudoku puzzle is not correct till now. "+num+" repeats in the same row ("+(row+1)+","+(col+1)+") and ("+(ret[1]+1)+","+(ret[2]+1)+")");
                    else if(col==ret[2])
                        alert("The Sudoku puzzle is not correct till now. "+num+" repeats in the same col ("+(row+1)+","+(col+1)+") and ("+(ret[1]+1)+","+(ret[2]+1)+")");
                    else
                        alert("The Sudoku puzzle is not correct till now. "+num+" repeats in the same 3*3 grid ("+(row+1)+","+(col+1)+") and ("+(ret[1]+1)+","+(ret[2]+1)+")");
                    return false;
                }
            }
        }
        return true;
    }


    function solve(grid, row, col) {

        if (row == 9)
            return true;

        let nextRow, nextCol;

        if (col == 8) {
            nextRow = row + 1;
            nextCol = 0;
        }
        else {
            nextRow = row;
            nextCol = col + 1;
        }

        if (grid[row * 9 + col] !== 0)
            return solve(grid, nextRow, nextCol);

        for (let val = 1; val <= 9; val++) {
            if (isPossible(grid, row, col, val)[0]) {
                grid[row * 9 + col] = val;
                let next = solve(grid, nextRow, nextCol);
                if (next === true)
                    return true;
                grid[row * 9 + col] = 0;
            }
        }
        return false;
    }


    function isPossible(grid, row, col, val) {
        // same row
        for (let j = 0; j < 9; j++) {
            if (j != col && grid[row * 9 + j] === val){
                return [false,row,j];
            }
        }

        // same col
        for (let i = 0; i < 9; i++) {
            if (i != row && grid[i * 9 + col] === val)
                return [false,i,col];
        }

        // same 3*3 matrix
        let topRow = Math.floor(row / 3) * 3;
        let topCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let checkRow = (topRow + i);
                let checkCol = (topCol + j);
                if (!(checkRow === row && checkCol === col) && grid[(topRow + i) * 9 + (topCol + j)] === val)
                    return [false,checkRow,checkCol];
            }
        }
        return [true,-1,-1];
    }

    function setGridValues(values) {
        const inputs = Array.from(sudokuGrid.children);
        values.forEach((value, index) => {
            inputs[index].value = value ? value : '';
            if (value) {
                inputs[index].classList.add('initial');
            } else {
                inputs[index].classList.remove('initial');
            }
        });
    }

    // Reset button functionality

    function resetGrid() {
        setGridValues(Array(81).fill(0));
    }

    // Check button functionality

    function checkGrid() {
        const grid = getGridValues();
        if (isSolved(grid)) {
            alert('The Sudoku puzzle is solved correctly!');
        } else{
            if(isCorrectTillNow(grid)){
                alert('The Sudoku puzzle is solved correctly till now!');
            }
        } 
    }

    function isSolved(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = grid[row * 9 + col];
                if (num === 0 || !isPossible(grid, row, col, num)[0]) {
                    return false;
                }
            }
        }
        return true;
    }

});
