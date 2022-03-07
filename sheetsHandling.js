let activeSheetColor = "rgb(190, 175, 160)";
let sheetFolderCont = document.querySelector(".sheet-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");
addSheetBtn.addEventListener("click" , function(e){
    let sheet = document.createElement("div");
    sheet.setAttribute("class" , "sheet-folder");
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id" , allSheetFolders.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`;
    sheetFolderCont.appendChild(sheet);
    // DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})
function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown" , function(e){
        if(e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if(allSheetFolders.length === 1){
            alert("You Need To Have Atleast One Sheet");
            return;
        }
        let response = confirm("Your Sheet Will Be Removed Permanently. Are You Sure ?");
        if(response === false) return;
        let sheetIdx = Number(sheet.getAttribute("id"));
        //  DB Removal
        collectedSheetDB.splice(sheetIdx , 1);
        collectedGraphComponent.splice(sheetIdx , 1);
        //  UI Removal
        handleSheetUIRemoval(sheet);

        // By default Bring Sheet 1 to Activeness
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    } )
}
function handleSheetUIRemoval(sheet){
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0 ; i < allSheetFolders.length ; i++){
        allSheetFolders[i].setAttribute("id" , i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i + 1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function createSheetDB(){
    let sheetDB = [];
    for(let i = 0 ; i < rows ; i++){
        let sheetRow = [];
        for(let j = 0 ; j < cols ; j++){
            let cellProp = {
                bold: false ,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "Arial",
                fontSize: "12",
                fontColor: "#000000",
                // BGcolor: "#ecf0f1",
                BGcolor: "white",
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}


function createGraphComponentMatrix(){

    let graphComponentMatrix = [];

    for(let i = 0 ; i < rows ; i++){
        let row = [];
        for(let j = 0 ; j < cols ; j++){
            // Why array? -> cause cell could have more than one P-C relation.
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}

function handleSheetActiveness(sheet){
        sheet.addEventListener("click" , function(e){
        let sheetIdx = (Number)(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);  
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}
function handleSheetDB(sheetIdx){
     sheetDB = collectedSheetDB[sheetIdx];
     graphComponentMatrix = collectedGraphComponent[sheetIdx];
}
function handleSheetProperties(){
    for(let i = 0 ; i < rows ; i++){
        for(let j = 0 ; j < cols ; j++){
            let cell = document.querySelector(`.cells[rID="${i}"][cID="${j}"]`);
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cells");
    firstCell.click();  
}
function handleSheetUI(sheet){
    let allSheetsFolder = document.querySelectorAll(".sheet-folder");
    for(let i = 0 ; i < allSheetsFolder.length ; i++){
        allSheetsFolder[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}