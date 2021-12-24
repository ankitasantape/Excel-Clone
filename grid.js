let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-container");
let addressRowCont = document.querySelector(".address-row-container");
let cellsContainer = document.querySelector(".cells-container");
let addressBar = document.querySelector(".address-bar");

// column containing address of numbers from 1 to 100
for(let i = 0; i < rows; i++){
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col");
    addressCol.innerText = i + 1;
    addressColCont.appendChild(addressCol);
}

// row containing address of numbers from 1 to 100
for(let i = 0; i < cols; i++){
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRowCont.appendChild(addressRow); 
}

// cells
for(let i = 0; i < rows; i++){
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "rowCont");
    for(let j = 0; j < cols; j++){
       let cell = document.createElement("div");
       cell.setAttribute("class", "cell");
       cell.setAttribute("contenteditable", "true");
       cell.setAttribute("spellcheck", "false");   
       // attribute for cell and storage identification
       cell.setAttribute("rid", i); 
       cell.setAttribute("cid", j);    
       rowCont.appendChild(cell);
       // to get address of row, col in address bar 
       addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsContainer.appendChild(rowCont);
}

function addListenerForAddressBarDisplay(cell, i, j){
    cell.addEventListener("click", (e) => {
        let rowId = i + 1;
        let colId = String.fromCharCode(65 + j);
        addressBar.value = `${colId}${rowId}`;
    })
}

// By default click on first cell 
let firstCell = document.querySelector(".cell");
firstCell.click();