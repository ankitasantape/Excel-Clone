// file for the addressBar & grid 

let rows = 100;
let cols = 26;
let addressBar = document.querySelector(".address-bar");
let leftCol = document.querySelector(".left-col");
let topRow = document.querySelector(".top-row");
let grid = document.querySelector(".grid");
for(let i = 0 ; i < rows ; i++){
    let div = document.createElement("div"
    );
    div.setAttribute("class" , "left-col-cell");
    div.innerText = i + 1;
    leftCol.append(div);
}
for(let i = 0 ; i < 26 ; i++){
    let div = document.createElement("div");
    div.setAttribute("class" , "top-row-cell");
    div.innerText = String.fromCharCode(65 + i);
    topRow.append(div);
}
for(let i = 0 ; i < rows ; i++){
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class" , "row-cont");
    for(let j = 0 ; j < cols ; j++){
        let cells = document.createElement("div");
        cells.setAttribute("contenteditable" , "true")
        cells.setAttribute("spellcheck" , "false");
        cells.setAttribute("class" , "cells");

        //Attributes for cell and storage identification
        cells.setAttribute("rID" , i);
        cells.setAttribute("cID" , j);

        rowCont.appendChild(cells);
        displayAddressBar(cells , i , j);
    }
    grid.appendChild(rowCont);   
}

function displayAddressBar(cells , i , j){
    cells.addEventListener("click" , function(){
        let rowID = i + 1;
        let colID = String.fromCharCode(65 + j);
        addressBar.value = `${colID}${rowID}`

    })
}

// By default click on first cell via DOM

// Method 1 of doing this
// let firstCell = document.querySelectorAll(".cells");
// firstCell[0].click();

//Method 2 of doing this
// let firstCell = document.querySelector(".cells");
// firstCell.click();

// THE METHOD 2 WORKS BECAUSE document.queryselector for 
//multiple classes will select the first most value 
// and hence we are able to click on A1 cell.