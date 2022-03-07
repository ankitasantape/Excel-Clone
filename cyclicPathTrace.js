//  For Delay And Wait Purpose
async function colorPromise() {
    return new Promise( (resolve , reject) =>{
        setTimeout(() => {
            resolve();
        } , 1000)
    })
}
async function isGraphCyclicTracePath(graphComponentMatrix , cycleResponse) {
    let[srcr , srcc] = cycleResponse;
    let visited = []; 
    let dfsVisited = []; 

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

    // for(let i = 0 ; i < rows ; i++){
    //     for(let j = 0 ; j < cols ; j++){
    //         if(visited[i][j] == false){
    //             let response = dfsCycleValidationTracePath(graphComponentMatrix , i , j , visited , dfsVisited);
    //             if(response == true){
    //                 return true;
    //             }
    //         }
    //     }
    // }
    let response = await dfsCycleValidationTracePath(graphComponentMatrix , srcr , srcc , visited , dfsVisited);
    if(response === true){
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
// Coloring Cells For Tracking
async function dfsCycleValidationTracePath(graphComponentMatrix , srcr , srcc , visited , dfsVisited){
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    let cell = document.querySelector(`.cells[rID="${srcr}"][cID="${srcc}"]`);
    cell.style.backgroundColor = "#CBC3E3";
    await colorPromise(); // Wait For 1 sec to resolve Promise

    for(let children = 0 ; children < graphComponentMatrix[srcr][srcc].length ; children++){
        let [nbrr , nbrc] = graphComponentMatrix[srcr][srcc][children];
        if(visited[nbrr][nbrc] == false){
            let response = await dfsCycleValidationTracePath(graphComponentMatrix , nbrr  , nbrc , visited , dfsVisited);
            if(response == true){
                cell.style.backgroundColor = "white";
                await colorPromise();
                return Promise.resolve(true); 
            }
        }else if(visited[nbrr][nbrc] == true && dfsVisited[nbrr][nbrc] == true){
            let cyclicCell =  document.querySelector(`.cells[rID="${srcr}"][cID="${srcc}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "white";
            await colorPromise();
            return Promise.resolve(true);
        }
    }
    cell.style.backgroundColor = "white";
    await colorPromise();
    dfsVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}