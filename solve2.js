const N = 9;
const UNASSIGNED = 0;
const EASY_LEVEL = 10;
const MEDIUM_LEVEL = 30;
const HARD_LEVEL = 60;
const EASY = 1;
const MEDIUM = 2;
const HARD = 3;


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

function clearGrid (N , isOverided = false) {
    for (var i = 0; i < N*N; i++) {
        if (isOverided)
            document.getElementsByName('cell')[i].removeAttribute('disabled');
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
async function printGridStepbyStep(log, delay, isSequence) {
    let logtemp= log.slice();
    if (isSequence)
        analysisLog(logtemp);
    for(let i = 0; i<logtemp.length;i++)
    {
        // console.log(getPos(log[i].row,log[i].col))
        document.getElementsByName('cell')[getPos(logtemp[i].row,logtemp[i].col)].value = await logtemp[i].value;
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
}

function randomNumber (N=9) {
    let randomnum=Math.floor((Math.random() * N))
    return randomnum<0?0:randomnum;
}

function createRandomPuzzle (level=1) {
    let grid = createEmptyPuzzle();
    solveSudoku(grid);
    let row;
    let col;
    let countHide;
    if (isNumeric(level)) {
        switch(level) {
            case 1:
                countHide = EASY_LEVEL;
                break;
            case 2:
                countHide = MEDIUM_LEVEL;
                break;
            case 3:
                countHide = HARD_LEVEL;
                break;
            default: countHide = HARD_LEVEL;
        }
    }
    while (countHide>0) {
        row = randomNumber();
        col = randomNumber();

        let isHide = randomNumber()>2?true:false; // Rate Hide is 80%;
            if (isHide && grid[row][col]!=0){
                countHide--;
                grid[row][col]=0;
            }
    }
    return grid;
}

function solvePuzzle (grid) {
    if (solveSudoku(grid)) {
    }
    else {
    console.log("Failed");
    }
}


function solveSudoku (grid ,sleepTime = 0) {
    let logSolve = []; // Log step by step in algorithm
    let i = 0; // index in logSovle
    let UnassignedLocation=[];
    let isFilled; // flag true if 
    // let numToStart=1;
    let possibleCell = [1,2,3,4,5,6,7,8,9];

    while (!isEmpty(UnassignedLocation = findUnassignedLocation(grid))) {
        isFilled= false;
        // for (let num = numToStart; num <= N; num++) { //For loop

        while (!isEmpty(possibleCell)) {
            let randNumPos = Math.floor(Math.random()*possibleCell.length);
            let num = possibleCell[randNumPos];
            possibleCell.splice(randNumPos,1);
            if (isSafe(grid,UnassignedLocation[0],UnassignedLocation[1],num)){

                grid[UnassignedLocation[0]][UnassignedLocation[1]]=num;
                logSolve.push({row:UnassignedLocation[0],col:UnassignedLocation[1], possibleCell:possibleCell,val:num}); // Save to logSolve 
                log.push({row:UnassignedLocation[0],col:UnassignedLocation[1],value:num});
                // console.log(`Assigned to [${UnassignedLocation[0]}][${UnassignedLocation[1]}] value: ${num}`)
                i++;
                isFilled=true;
                // numToStart = 1;
                possibleCell = [1,2,3,4,5,6,7,8,9];
                break;
            }
        }
        // }//End of for
        if (!isFilled){
            if(isEmpty(logSolve))
                return false;
            i--;
            grid[logSolve[i].row][logSolve[i].col]=UNASSIGNED;
            possibleCell = logSolve[i].possibleCell;
            //     return false;
            logSolve.pop();
        }
    }
    return true;
}


let grid=[];
let gridOriginal=[];
let log = []

// ADD event

let cells = document.getElementsByName('cell');
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('keyup', (event)=>{
        // event.target.value=''
        if (isNumeric(event.key)) {
            // console.log('OK')
            event.target.value=event.key;
        }
    })
}

document.getElementById('createSodoku').addEventListener('click', function () {
    clearGrid(N, true);
    let levelOptions = document.getElementsByName('level');
    let level;
    for (var i = 0; i < levelOptions.length; i++) {
        if (levelOptions[i].checked){
            level = i+1;
            break;
        }

    }
    grid = createRandomPuzzle(level);
    gridOriginal = grid.slice();
    printGrid(grid,N);
    let cells = document.getElementsByName('cell');
    for (var i = 0; i < cells.length; i++){
        if(cells[i].value!='')
            cells[i].setAttribute('disabled','true')
    }
    // alert('message?: DOMString')
})
document.getElementById('solveSodoku').addEventListener('click', function () {
    log=[];
    solvePuzzle(grid);
    // clearGrid(N);
    // printGrid(grid,N);
    let sleepTime = document.getElementById('sleepTime').value;
    if (sleepTime==0)
        printGrid(grid,N);
    else
        printGridStepbyStep(log,sleepTime,document.getElementById('sequence').checked);
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


