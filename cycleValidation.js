// Storage -> 2D ARRAY
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for(let i = 0 ; i < rows ; i++){
//     let row = [];
//     for(let j = 0 ; j < cols ; j++){
//         // Why array? -> cause cell could have more than one P-C relation.
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }
//  True -> Cyclic  
//  False -> Not Cyclic
function isGraphCyclic(graphComponentMatrix) {
    // Dependency -> visited && DFSvisited (2D array)
    let visited = []; // Node visit trace
    let dfsVisited = []; // Stack visit trace

    for(let i = 0 ; i < rows ; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0 ; j < cols ; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i = 0 ; i < rows ; i++){
        for(let j = 0 ; j < cols ; j++){
            if(visited[i][j] == false){
                let response = dfsCycleValidation(graphComponentMatrix , i , j , visited , dfsVisited);
                if(response == true){
                    return [i , j];
                }
            }
        }
    }
    return null;
}

//  Start -> vis(TRUE) dfsVis(TRUE)
//  End -> dfsVis(FALSE)
//  If vis[i][j] -> already explored , so go back no use to explore again
// Cycle Detection Condition -> if(vis[i][j] == true && dfsVis[i][j] == true) i.e IT IS A CYCLE
//  Function will return a booleam value
// i.e  true means There is  Cycle 
//  False means there is no cycle

function dfsCycleValidation(graphComponentMatrix , srcr , srcc , visited , dfsVisited){
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for(let children = 0 ; children < graphComponentMatrix[srcr][srcc].length ; children++){
        let [nbrr , nbrc] = graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc] == false){
            let response = dfsCycleValidation(graphComponentMatrix , nbrr  , nbrc , visited , dfsVisited);
            if(response == true){
                return true;  // found cycle so return immediately , as even a single cycle makes the whole graph cyclic
            }
        }else if(visited[nbrr][nbrc] == true && dfsVisited[nbrr][nbrc] == true){
            // found cycle so return true immediately
            return true;
        }
    }
    dfsVisited[srcr][srcc] = false;
    return false;
}