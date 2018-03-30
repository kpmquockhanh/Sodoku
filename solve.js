const N = 9;
const UNASSIGNED = 0;

function printGrid(grid,N) {
    let pos=0;
    for (var row = 0; row < N; row++) {
        for (var col = 0; col < N; col++) {
            if (grid[row][col]!='')
                document.getElementsByName('cell')[pos].value = grid[row][col];
            pos++;
            
        }
    }
    
}

function clearGrid (N) {
    for (var i = 0; i < N*N; i++) {
        document.getElementsByName('cell')[i].classList.remove('bg-danger');
        document.getElementsByName('cell')[i].value = '';    
    }
}

function usedInRow(grid, row, num){
    for (let i=0; i<N ;i++)
        if (grid[row][i]==num)
            return true;
        return false;

}

function usedInColumn(grid, col, num){
    let arrCol=[];
    for (let i = 0; i < N; i++) {
        arrCol.push(grid[i][col])
    }
    for (let i=0; i<N ;i++)
        if (arrCol[i]==num)
            return true;
        return false;
}

function usedInBox(grid, fRow, fCol, num){
    fRow=(Math.floor(fRow/3))*3;
    fCol=(Math.floor(fCol/3))*3;
    for (let row = 0; row < 3; row++)
        for (let col = 0; col < 3; col++)
            if(grid[fRow+row][fCol+col]==num)
                return true;
    return false;
    
}

function isSafe(grid, row, col, num){
    return !usedInRow(grid, row, num) &&
        !usedInColumn(grid, col, num) &&
        !usedInBox(grid, row, col, num);
}

function isCorrectRow (grid,row) {
    for (let i = 1; i < N; i++)
    {
        let isAppear = false;
        for (let col = 0; col < N; col++)
        {
            if (grid[row][col]==i)
                isAppear=true;

        }
        if (!isAppear)
            return false; 
    }
    return true;
}

function isCorrectCol (grid,col) {
    for (let i = 1; i < N; i++)
    {
        let isAppear = false;
        for (let row = 0; row < N; row++)
        {
            if (grid[row][col]==i)
                isAppear=true;

        }
        if (!isAppear)
            return false; 
    }
    return true;
}

function isCorrectBox (grid,i) {
    let offsetRow = (i%3)*3;
    let offsetCol = (Math.floor(i/3))*3;
    // console.log(offsetCol)
    for (let i = 1; i < N; i++)
    {
        let isAppear = false;
        for (let row = offsetRow; row < offsetRow + 3; row++)
            for (let col = offsetCol; col < offsetCol + 3; col++)
            {
                if(grid[row][col]==i)
                isAppear=true;
            }
            if (!isAppear)
            return false; 
    }
    return true;

}

function isSolved (grid) {
    for (let i = 0; i < N; i++) {
        if (!isCorrectRow(grid,i) || !isCorrectCol(grid,i) || !isCorrectBox(grid,i))
            return false;
    }
    return true;
}

function isEmpty (arr) {
    if(typeof arr != "undefined" && arr.length > 0)
        return false;
    return true;
}

function findUnassignedLocation(grid){
    for (let irow = 0; irow < N; irow++)
    for (let icol = 0; icol < N; icol++)
        if (grid[irow][icol] == UNASSIGNED)
        {
            return [irow,icol]
        }
        
    return [];
}


// function solveSudoku(grid){
//     let row={value:0}
//     let col={value:0}

//     if (!findUnassignedLocation(grid, row, col))
//     return true; // success! no empty space
//     for (let num = 1; num <= N; num++) {
//         if (isSafe(grid, row.value, col.value, num)) {
//             grid[row.value][col.value] =  num; // make tentative assignment
//             log.push({
//                 row:row.value,
//                 col:col.value,
//                 value:num
//             })
//             if (solveSudoku(grid))
//                 return true;  // return, if success// return, if success
//              grid[row.value][col.value] =  UNASSIGNED;  // failure, unmake & try again
//         }
//     }
//     return false; // triggers backtracking
// }

function solveSudoku (grid) {
    let logSolve = []; // Log step by step in algorithm
    let i = 0; // index in logSovle
    let UnassignedLocation=[];
    let isFilled; // flag true if 
    let numToStart=1;

    while (isSolved) {
        isFilled= false;
        UnassignedLocation = findUnassignedLocation(grid);
        if(isEmpty(UnassignedLocation))
            return true //Solved
        for (let num = numToStart; num <= N; num++) {
            if (isSafe(grid,UnassignedLocation[0],UnassignedLocation[1],num)){
                grid[UnassignedLocation[0]][UnassignedLocation[1]]=num;
                logSolve.push({row:UnassignedLocation[0],col:UnassignedLocation[1],val:num}); // Save to logSolve 
                i++;
                isFilled=true;
                numToStart = 1;
                //console.log('Grid '+ UnassignedLocation[0] + ' - ' + UnassignedLocation[1] + ' = ' +num)
                break;
            }
        }
        if (!isFilled){
            i--;
            grid[logSolve[i].row][logSolve[i].col]=UNASSIGNED;
            //console.log('Grid '+ logSolve[i].row + ' - ' + logSolve[i].row + ' = ' +UNASSIGNED)
            numToStart = logSolve[i].val+1;
            if(numToStart > 9 && logSolve[i].row == 0 && logSolve[i].col==0)
                return false;
            logSolve.pop();

            
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getPos (row, col) {
    return 9*(row)+col;
}

function analysisLog (log) {
    for(let i = log.length-1; i>=0; i--)
        for(let j = i-1; j>=0; j--)
            if(log[i].row==log[j].row && log[i].col==log[j].col)
                log.splice(j, 1 );
}
async function printGridStepbyStep(log,delay) {
    for(let i = 0; i<log.length;i++)
    {
        // console.log(getPos(log[i].row,log[i].col))
        document.getElementsByName('cell')[getPos(log[i].row,log[i].col)].value = await log[i].value;
        await sleep(delay*1000);
    }
}

function checkSubmit (grid) {
    //Scan grid
    let f=false;
    for (let row = 0; row<N; row++)
        for (let col = 0; col<N; col++){
            if(grid[row][col] != document.getElementsByName('cell')[getPos(row,col)].value)
            {
                document.getElementsByName('cell')[getPos(row,col)].classList.add('bg-danger')
                f=true;
            }
            else{
                document.getElementsByName('cell')[getPos(row,col)].classList.remove('bg-danger')
            }

        }
    if (f) 
        return false;
    return true;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function createEmptyPuzzle (N=9) {
    return  [
    [0, 0, 7, 0, 3, 0, 8, 0, 0],
    [0, 0, 0, 2, 0, 5, 0, 0, 0],
    [4, 0, 0, 9, 0, 6, 0, 0, 1],
    [0, 4, 3, 0, 0, 0, 2, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 5],
    [0, 5, 8, 0, 0, 0, 6, 7, 0],
    [5, 0, 0, 1, 0, 8, 0, 0, 9],
    [0, 0, 0, 5, 0, 3, 0, 0, 0],
    [0, 0, 2, 0, 9, 0, 5, 0, 0]
];
}

function randomNumber (N=9) {
    let randomnum=Math.floor((Math.random() * 10))
    return randomnum<0?0:randomnum;
}

function createRandomPuzzle () {
    let grid = createEmptyPuzzle();

    for (var row = 0; row < N; row++)
        for (var col = 0; col < N; col++){
            let num = randomNumber();
            let rate = randomNumber();
            if (isSafe(grid,row,col,num) && rate>=8)
                grid[row][col]=num;
        }
    return grid;
}



let grid= createEmptyPuzzle();
// console.log(grid);
let gridOriginal=[];

function solvePuzzle (grid) {
    if (solveSudoku(grid)) {
    // let sleepTime = document.getElementById('sleepTime').value;
    // analysisLog(log);
    }
    else {
    console.log("Failed");
    }
}

// if (solveSudoku(grid)) {
//     // let sleepTime = document.getElementById('sleepTime').value;
//     analysisLog(log)
// }
// else {
//     alert('Failed')
// }

let cells = document.getElementsByName('cell');
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('keyup', (event)=>{
        // event.target.value=''
        if (isNumeric(event.key)) {
            // console.log('OK')
            event.target.value=event.key
        }
    })
}

document.getElementById('createSodoku').addEventListener('click', function () {
    clearGrid(N);
    grid = createEmptyPuzzle();
    gridOriginal = grid.slice(0);
    
    printGrid(gridOriginal,N);
    let cells = document.getElementsByName('cell');
    for (var i = 0; i < cells.length; i++){
        if(cells[i].value!='')
            cells[i].setAttribute('disabled','true')
    }
    // alert('message?: DOMString')
})
document.getElementById('solveSodoku').addEventListener('click', function () {
    solvePuzzle(grid);
    clearGrid(N);
    printGrid(gridOriginal,N);
    printGrid(grid,N);
    let sleepTime = document.getElementById('sleepTime').value;
    // printGridStepbyStep(log,sleepTime);
})
document.getElementById('submit').addEventListener('click', function () {
    solvePuzzle(grid);
    if (checkSubmit(grid)){
        document.getElementById('correct').classList.remove('d-none')
        document.getElementById('incorrect').classList.add('d-none')
    }
    else{
        document.getElementById('correct').classList.add('d-none')
        document.getElementById('incorrect').classList.remove('d-none')
    }

})


