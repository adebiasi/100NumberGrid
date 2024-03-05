let grid;
let gridToDisplay;
let rows = 5;
let cols = 5;
let numbers = [];
let currPos
let moves = [];
let wait = 0;
let possibleMoves;

function setFirstPosition() {
    currPos = [int(float(cols) / 2), int(float(rows) / 2)]
    moves.push(currPos);
    setGridValue(currPos[0], currPos[1], gridToDisplay, moves.length);
}

function setup() {
    let runButton = select('#run');
    runButton.mousePressed(() => {
        console.time('run ');
        if(currPos.length == 0){
            setFirstPosition();
        }
        [retScore, gridToDisplay] = bruteForce(currPos, gridToDisplay, moves.length);
        redraw();

        console.timeEnd('run');

    });
    let runGreedyButton = select('#run_greedy');
    runGreedyButton.mousePressed(() => {
        console.time('run_greedy');
        if(currPos.length == 0){
            setFirstPosition();
        }
        [retScore, gridToDisplay] = greedy(currPos, gridToDisplay, moves.length);
        redraw();

        console.timeEnd('run_greedy');

    });
    let runGreedy2Button = select('#run_greedy2');
    runGreedy2Button.mousePressed(() => {
        console.time('run_greedy2');
        if(currPos.length == 0){
            setFirstPosition();
        }
        [retScore, gridToDisplay] = mixed(currPos, gridToDisplay, moves.length);
        redraw();

        console.timeEnd('run_greedy2');
    });
    let resetButton = select('#reset');
    resetButton.mousePressed(() => {
        reset();
    });

    let rowsSlider = select('#rows');
    rowsSlider.input(() => {
        console.log("rowsssss")
        reset();
    });

    let colsSlider = select('#cols');
    colsSlider.input(() => {
        reset();
    });

    let waitSlider = select('#wait');
    waitSlider.input(() => {
        wait = parseInt(select("#num_seconds").html()) * 1000;
        redraw();
    });

    createCanvas(400, 400);
    background(220);
    // grid = createEmptyGrid(rows, cols);
    reset();
    possibleMoves =
        [[3, 0], [0, 3], [-3, 0], [0, -3],
            [2, 2], [-2, -2], [2, -2], [-2, 2]];
    console.log("calculate...");
    // console.log("init grid: " + grid);
    // currPos = createVector(0, 0);
    // currPos = [0, 0];
    // moves.push(currPos);
    setGridValue(currPos[0], currPos[1], gridToDisplay, moves.length);

    // [retScore, gridToDisplay] = findBestMove(currPos, grid, moves.length);

    //grid = retGrid;
    // gridToDisplay = retGrid;
    // gridToDisplay = grid;
    // console.log(score);
    console.log(moves);
    noLoop();
}

function reset() {
    moves = [];
    currPos = [];

    rows = parseInt(select("#num_rows").html());
    cols = parseInt(select("#num_cols").html());
    gridToDisplay = createEmptyGrid(rows, cols);

    redraw();
    noLoop();

}

function draw() {
    background(220);
    displayGrid(gridToDisplay, width, height);
}


function createEmptyGrid(rows, cols) {
    let emptyGrid = [];
    for (let i = 0; i < rows * cols; i++) {
        emptyGrid.push('');
    }
    return emptyGrid;
}

function getGridValue(grid, y, x) {
    return grid[cols * y + x];
}

function setGridValue(y, x, grid, value) {
    grid[cols * y + x] = value;
}

function displayGrid(grid, width, height) {

    let cellWidth = width / cols;
    let cellHeight = height / rows;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (getGridValue(grid, y, x) !== '') {
                fill(255, 0, 0);
                textAlign(CENTER, CENTER);
                textSize(20);
                text(getGridValue(grid, y, x), x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
            }
            noFill();
            stroke(0);
            rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
}

function isPossible(nextPos, grid) {
    if (nextPos[0] < 0 || nextPos[0] > cols - 1 || nextPos[1] < 0 || nextPos[1] > rows - 1 || getGridValue(grid, nextPos[1], nextPos[0]) !== '') {
        return false;
    }
    return true;
}

function bruteForce(currPos, grid, prevScore) {

    let maxScore = prevScore;
    let chooseGrid = copyGrid(grid);

    for (let i = 0; i < possibleMoves.length; i++) {

        let currPossMove = possibleMoves[i];
        let nextPos = [currPos[0] + currPossMove[0], currPos[1] + currPossMove[1]];

        if (isPossible(nextPos, grid)) {
            let copiedGrid = copyGrid(grid);
            setGridValue(nextPos[1], nextPos[0], copiedGrid, prevScore + 1);
            let retScore;
            let retGrid;

            if (wait != 0) {
                setTimeout(function () {
                    [retScore, retGrid] = bruteForce(nextPos, copiedGrid, prevScore + 1);
                }, wait);
            } else {
                [retScore, retGrid] = bruteForce(nextPos, copiedGrid, prevScore + 1)
            }

            if (retScore >= maxScore) {
                maxScore = retScore;
                chooseGrid = retGrid;
                if (wait != 0) {
                    gridToDisplay = chooseGrid;
                    redraw();
                }
            }
            if (retScore == rows * cols) {
                return [maxScore, chooseGrid];
            }
        }
    }

    gridToDisplay = chooseGrid;
    if (wait != 0) {
        redraw();
    }

    return [maxScore, chooseGrid];

}

function greedy(currPos, grid, prevScore) {

    let maxAvailableMoves = 100;
    let chooseGrid = copyGrid(grid);
    let choosePos;

    for (let i = 0; i < possibleMoves.length; i++) {
        let currPossMove = possibleMoves[i];
        let currNumMoves = '';
        let nextPos = [currPos[0] + currPossMove[0], currPos[1] + currPossMove[1]];
        if (isPossible(nextPos, grid)) {
            let copiedGrid = copyGrid(grid);
            setGridValue(nextPos[1], nextPos[0], copiedGrid, prevScore + 1);
            currNumMoves = numAvailableMoves(nextPos, copiedGrid)
            if (currNumMoves < maxAvailableMoves) {
                maxAvailableMoves = currNumMoves;
                chooseGrid = copiedGrid;
                choosePos = nextPos;
            }
        }
    }

    gridToDisplay = chooseGrid;
    if (wait != 0) {
        setTimeout(function () {
            redraw();
            if (choosePos != null) {
                return greedy(choosePos, chooseGrid, prevScore + 1)
            }
        }, wait);
    } else {
        if (choosePos != null) {
            return greedy(choosePos, chooseGrid, prevScore + 1)
        }
    }
    return [prevScore, chooseGrid];
}

function mixed(currPos, grid, prevScore) {

    let maxScore = prevScore;
    let chooseGrid = copyGrid(grid);
    let [availableMovesForPossibleMoves, minAvailableMoves] = calcAvailMovesForPossMoves(currPos, grid);
    for (let i = 0; i < possibleMoves.length; i++) {
        let currPossMove = possibleMoves[i];
        let nextPos = [currPos[0] + currPossMove[0], currPos[1] + currPossMove[1]];
        if (isPossible(nextPos, grid) && availableMovesForPossibleMoves[i] == minAvailableMoves) {
            let copiedGrid = copyGrid(grid);
            setGridValue(nextPos[1], nextPos[0], copiedGrid, prevScore + 1);
            let retScore;
            let retGrid;
            if (wait != 0) {
                setTimeout(function () {
                    [retScore, retGrid] = mixed(nextPos, copiedGrid, prevScore + 1)
                    redraw();
                }, wait);
            } else {
                [retScore, retGrid] = mixed(nextPos, copiedGrid, prevScore + 1)
            }
            if (retScore >= maxScore) {
                maxScore = retScore;
                chooseGrid = retGrid;
            }
            if (retScore == rows * cols) {
                return [maxScore, chooseGrid];
            }
        }
    }

    gridToDisplay = chooseGrid;
    if (wait != 0) {
        redraw();
    }
    return [maxScore, chooseGrid];
}

function calcAvailMovesForPossMoves(currPos, grid) {
    let availableMovesForPossibleMoves = []
    let minAvailableMoves = 100;

    for (let i = 0; i < possibleMoves.length; i++) {

        let currPossMove = possibleMoves[i];
        let currNumMoves = '';
        let nextPos = [currPos[0] + currPossMove[0], currPos[1] + currPossMove[1]];
        if (isPossible(nextPos, grid)) {
            let copiedGrid = copyGrid(grid);
            setGridValue(nextPos[1], nextPos[0], copiedGrid, 'X');
            currNumMoves = numAvailableMoves(nextPos, copiedGrid)

            if (currNumMoves < minAvailableMoves) {
                minAvailableMoves = currNumMoves;
            }
        }
        availableMovesForPossibleMoves.push(currNumMoves)
    }
    return [availableMovesForPossibleMoves, minAvailableMoves];
}

function numAvailableMoves(pos, grid) {
    let availableMoves = 0;

    for (let i = 0; i < possibleMoves.length; i++) {

        let currPossMove = possibleMoves[i];

        let nextPos = [pos[0] + currPossMove[0], pos[1] + currPossMove[1]];
        if (isPossible(nextPos, grid)) {
            availableMoves++;
        }
    }

    return availableMoves;
}

function copyGrid(array) {
    return array.slice();
}

function mouseClicked() {

    console.log("mouseClicked")
    let cellWidth = width / cols;
    let cellHeight = height / rows;

    let x = floor(mouseX / cellWidth);
    let y = floor(mouseY / cellHeight);

    let mousePos = [x, y]
    if (isPossible(mousePos, gridToDisplay)) {
        if (currPos.length == 0) {
            moves.push(mousePos);
            setGridValue(y, x, gridToDisplay, moves.length);
            currPos = mousePos;
        } else {
            for (let k = 0; k < possibleMoves.length; k++) {

                let currPossMove = possibleMoves[k];
                let nextPos = [currPos[0] + currPossMove[0], currPos[1] + currPossMove[1]];
                if (nextPos[0] == mousePos[0] && nextPos[1] == mousePos[1]) {
                    moves.push(nextPos);
                    setGridValue(y, x, gridToDisplay, moves.length);
                    currPos = nextPos;
                }
            }
        }

    }
    redraw();

}