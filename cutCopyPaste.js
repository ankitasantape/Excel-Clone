let ctrlKey;
document.addEventListener("keydown", function(e) {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", function(e){
    ctrlKey = e.ctrlKey;
})

for (let i = 0 ; i < rows ; i++) {
    for (let j = 0 ; j < cols ; j++) {
        let cell = document.querySelector(`.cells[rID="${i}"][cID="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", function(e){
        // Select cells range work
        if (!ctrlKey) return;
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rID"));
        let cid = Number(cell.getAttribute("cID"));
        rangeStorage.push([rid, cid]);
        // console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI() {
    for (let i = 0;i < rangeStorage.length;i++) {
        let cell = document.querySelector(`.cells[rID="${rangeStorage[i][0]}"][cID="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

let copyData = [];
let cutData = [];
let cutClicked = false;
let copyClicked = false;
var tempArray = [];
copyBtn.addEventListener("click", function(e){
    copyClicked = true;
    if (rangeStorage.length < 2) return;
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        let copyRow = [];
        for (let j = stcol;j <= endcol;j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", function(e){
    cutClicked = true;
    if (rangeStorage.length < 2) return;

    cutData = [];
    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for(let i = strow ; i <= endrow ; i++){
        let cutRow = [];
        for(let j = stcol ; j <= endcol ; j++){
            let cellProp = sheetDB[i][j];
            console.log(cellProp);
            cutRow.push(cellProp);
        }
        cutData.push(cutRow);
    }
    tempArray = []; 
    tempArray = JSON.parse(JSON.stringify(cutData)); // without reference  array
    //   as paste is not working after cut , because when objects is stored inside an array
    //  it creates a shallow copy and if u perform any changes it will reflect back in the 
    //  original array.

    for (let i = strow;i <= endrow;i++) {
        for (let j = stcol;j <= endcol;j++) {
            let cell = document.querySelector(`.cells[rID="${i}"][cID="${j}"]`);
            // DB
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 12;
            cellProp.fontFamily = "Arial";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "white";
            // cellProp.BGcolor = "#ecf0f1";
            cellProp.alignment = "left";

            // UI
            cell.click();
        }
    }

    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click" , function(e){
    // Past cells data work
    if (rangeStorage.length != 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // Target
    let address = addressBar.value;
    let [stRow, stCol] = indexDecoder(address);


    // r -> refers copydata row
    // c -> refers copydata col
    for (let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {
        for (let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
            let cell = document.querySelector(`.cells[rID="${i}"][cID="${j}"]`);
            // console.log(cell);
            if (!cell) continue;

            // DB
            let data ;
            if(copyClicked === true){
                data = copyData[r][c];
            }else if(cutClicked === true){
                data = tempArray[r][c];
            }
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;            
            // UI
            cell.click();
        }
    }
    cutClicked = false;
    copyClicked = false;
})