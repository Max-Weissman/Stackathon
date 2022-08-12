const random = 0.5 //number of squares that are trees
const size = 20 //width and height of grid

const makeGrid = () => {
    let grid = []
    for (let i = 0; i <= size; i++){
        let arr = []
        for (let j = 0; j <= size; j++){
            if (Math.random() > random){
                arr.push("")
            }
            else{
                arr.push("1")
            }
        }
        grid.push(arr)
    }
    return grid
}


const solveGrid = (grid) => {
    if (grid[0][0] === "1" || grid[size][size] === "1"){
        return false
    }
    let trav = [0]
    let checked = []
    while(trav.length > 0){
        if (trav[0] === size * size - 1){
            return true
        }
        let right = trav[0]
        let left = trav[0]
        let up = trav[0]
        let down = trav[0]
        if ((right + 1) % size === 0){
            right = 0
        }
        right++
        if (left % size === 0){
            left = 0
        }
        left--
        up -= size
        down += size
        if (right < size * size){ //Checks if within index of grid
            if (grid[Math.floor(right / size)][right % size] === ''){ //checks if that cell is a wall
                if (!checked.includes(right) && !trav.includes(right)){ //checks if already checked that cell
                    trav.push(right)
                }
            }
        }
        if (left > -1){
            if (grid[Math.floor(left / size)][left % size] === ''){
                if (!checked.includes(left) && !trav.includes(left)){
                    trav.push(left)
                }
            }
        }
        if (up > -1){
            if (grid[Math.floor(up / size)][up % size] === ''){
                if (!checked.includes(up) && !trav.includes(up)){
                    trav.push(up)
                }
            }
        }
        if (down < size * size){
            if (grid[Math.floor(down / size)][down % size] === ''){
                if (!checked.includes(down) && !trav.includes(down)){
                    trav.push(down)
                }
            }
        }
        checked.push(trav.shift())
    }
    return false
}


let grid = []
while(grid.length === 0){
    grid = makeGrid()
    if (!solveGrid(grid)){
        grid = []
    }
}

export default grid