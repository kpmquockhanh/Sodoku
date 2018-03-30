const N = 9;
const UNASSIGNED = 0;
const EASY_LEVEL = 30;
const MEDIUM_LEVEL = 50;
const HARD_LEVEL = 65;
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
            return [irow,icol];
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
    isPrinting = true;
    let logtemp= log.slice();
    if (isSequence)
        analysisLog(logtemp);
    for(let i = 0; i<logtemp.length;i++)
    {
        if (canceled)
            return;

        // console.log(getPos(log[i].row,log[i].col))
        document.getElementsByName('cell')[getPos(logtemp[i].row,logtemp[i].col)].value = await logtemp[i].value;
        await sleep(delay*1000);
    }
    isPrinting = false;
}

function checkSubmit (grid) {
    //Scan grid
    let f=false;
    for (let row = 0; row<N; row++)
        for (let col = 0; col<N; col++){
            if(grid[row][col] != document.getElementsByName('cell')[getPos(row,col)].value)
            {
                document.getElementsByName('cell')[getPos(row,col)].classList.add('bg-danger');
                f=true;
            }
            else{
                document.getElementsByName('cell')[getPos(row,col)].classList.remove('bg-danger');
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
    let tempArr = [];
    let grid = [];
    for (var i = 0; i < N; i++) {
            tempArr.push(0);
    }

    for (var i = 0; i < N; i++) {
            grid.push(tempArr.slice());
    }
    return grid;
}

function randomNumber (N=9) {
    let randomnum=Math.floor((Math.random() * N));
    return randomnum<0?0:randomnum;
}

function createRandomPuzzle (level=EASY) {
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


function solveSudoku (grid ,sleepTime = 0) {

    let logSolve = []; // Log step by step in algorithm
    let i = 0; // index in logSolve
    let UnassignedLocation=[];
    let isFilled; // flag true if 
    let possibleNum = [1,2,3,4,5,6,7,8,9];
    while (!isEmpty(UnassignedLocation = findUnassignedLocation(grid))) {
        isFilled= false;

        while (!isEmpty(possibleNum)) {
            let randNumPos = Math.floor(Math.random()*possibleNum.length);
            let num = possibleNum[randNumPos];
            possibleNum.splice(randNumPos,1);
            if (isSafe(grid,UnassignedLocation[0],UnassignedLocation[1],num)){

                grid[UnassignedLocation[0]][UnassignedLocation[1]]=num;
                logSolve.push({row:UnassignedLocation[0],col:UnassignedLocation[1], possibleNum:possibleNum,val:num}); // Save to logSolve 
                log.push({row:UnassignedLocation[0],col:UnassignedLocation[1],value:num});
                i++;
                isFilled=true;
                possibleNum = [1,2,3,4,5,6,7,8,9];
                break;
            }
        }
        if (!isFilled){
            if(isEmpty(logSolve))
                return false;
            i--;
            grid[logSolve[i].row][logSolve[i].col]=UNASSIGNED;
            possibleNum = logSolve[i].possibleNum;
            logSolve.pop();
        }
    }
    return true;
}


let grid=[];
let gridOriginal=[];
let log = [];
let canceled;
let isPrinting;



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
    if (isPrinting) {
        canceled = true;
        document.getElementById('canceled').classList.remove('invisible');
    }
    else
        canceled = false;
    console.log(canceled);
    isPrinting = false;
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
    document.getElementById('Solved').classList.add('invisible');
    document.getElementById('canceled').classList.add('invisible');
    // alert('message?: DOMString')
});
document.getElementById('solveSudoku').addEventListener('click',async function () {
    // isPrinting = false;
    log=[];
    if (solveSudoku(grid)) {
        let sleepTime = document.getElementById('sleepTime').value;
        if (sleepTime==0)
            printGrid(grid,N);
        else
            await printGridStepbyStep(log,sleepTime,document.getElementById('sequence').checked);
        if (!canceled)
            await document.getElementById('Solved').classList.remove('invisible');
    };
    // clearGrid(N);
    // printGrid(grid,N);
    
});
document.getElementById('submit').addEventListener('click', function () {
    solveSudoku(grid);
    if (checkSubmit(grid)){
        document.getElementById('correct').classList.remove('d-none')
        document.getElementById('incorrect').classList.add('d-none')
    }
    else{
        document.getElementById('correct').classList.add('d-none')
        document.getElementById('incorrect').classList.remove('d-none')
    }
    document.getElementById('Solved').classList.add('invisible');
    document.getElementById('canceled').classList.add('invisible');

});
document.getElementById('cancelSodoku').addEventListener('click', function () {
    if (isPrinting) {
        canceled = true;
        document.getElementById('canceled').classList.remove('invisible');
    }
});


