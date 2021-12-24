// Storage -> 2D matrix (Basic needed)
let graphComponentMatrix = [];

for (let i = 0; i < rows; i++){
    let row = [];
    for (let j = 0; j < cols; j++){
        
        // Why array -> More than 1 child relation(dependency)
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

// true - cyclic , False -> Not cyclic 
function isGraphCyclic(graphComponentMatrix) {
    //  Dependency hai visited arr ki and dfsVisited arr ki 
    let visited = [];  // Node visit trace
    let dfsVisited = []; // arr for stack visit trace 
    
    // make dependency
    for (let i = 0; i < rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push( visitedRow );
        dfsVisited.push( dfsVisitedRow );
    }
    
    // make call on different row and col
    for (let i = 0; i < rows; i++){
        for (let j = 0; j < cols; j++){
            if( visited[i][j] === false){
                let response =  dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                // Found cycle so return immediately, no need to explore more
                if (response === true) return true;     
            }  
        }
    }

    return false;
}

// Start -> visited(True), dfsVisited(true)
// End -> dfsVisited(FALSE)
// If visited[i][j] -> already explored path, so go back no use to explore again
// Cycle detection condition -> if (visited[i][j] == true && dfsVisited[i][j] == true) -> cycle
// Return -> True/False
// true - cyclic , False -> Not cyclic 
function dfsCycleDetection(graphComponentMatrix, srcrow, srccol, visited, dfsVisited) {
   
    visited[srcrow][srccol] = true;
    dfsVisited[srcrow][srccol] = true;
    console.log(graphComponentMatrix + " " + srcrow + " " + srccol);
    //   A1 -> [[0, 1], [1, 0], [5, 10], ..... ]
    console.log( graphComponentMatrix[srcrow][srccol] + " -> " + graphComponentMatrix.length);
    for (let children = 0; children < graphComponentMatrix[srcrow][srccol].length; children++) {
        let [nbrrow, nbrcol] = graphComponentMatrix[srcrow][srccol][children];
        // console.log("cycle not found");
        if ( visited[nbrrow][nbrcol] === false ){
           let response = dfsCycleDetection(graphComponentMatrix, nbrrow, nbrcol, visited, dfsVisited);
           if (response === true) { return true; } // Found cycle so return immediately, no need to explore more.
        }
        else if (visited[nbrrow][nbrcol] === true && dfsVisited[nbrrow][nbrcol] === true) {
            // console.log("cycle found");
            return true; // Found cycle so return immediately, no need to explore more
        }
    }
    dfsVisited[srcrow][srccol] = false;
    return false;
}