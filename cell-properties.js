// file for properties of cell.
let collectedSheetDB = [] // this array will contains all the sheets 
let sheetDB = [];

{
    // displaying the default sheet i.e SHEET 1 also with 
    // the help of function.(it's HTML is also commented). 
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}

// for(let i = 0 ; i < rows ; i++){
//     let sheetRow = [];
//     for(let j = 0 ; j < cols ; j++){
//         let cellProp = {
//             bold: false ,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "Arial",
//             fontSize: "12",
//             fontColor: "#000000",
//             BGcolor: "#ecf0f1",
//             value: "",
//             formula: "",
//             children: []
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

let activeColorProp = "rgb(170, 145, 140)";
let inactiveColorProp = "#ddddda";

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

// adding event listeners
bold.addEventListener("click" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);
    cellProp.bold = !cellProp.bold; // DB Storage change
    cell.style.fontWeight = cellProp.bold === true ? "bold" : "normal" // UI Change (1);
    bold.style.backgroundColor = cellProp.bold === true ? activeColorProp : inactiveColorProp // UI Change (2);

})
italic.addEventListener("click" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);
    cellProp.italic = !cellProp.italic; // DB Storage change
    cell.style.fontStyle = cellProp.italic === true ? "italic" : "normal" // UI Change (1);
    italic.style.backgroundColor = cellProp.italic === true ? activeColorProp : inactiveColorProp // UI Change (2);

})
underline.addEventListener("click" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);
    cellProp.underline = !cellProp.underline; // DB Storage change
    cell.style.textDecoration = cellProp.underline === true ? "underline" : "none" // UI Change (1);
    underline.style.backgroundColor = cellProp.underline === true ? activeColorProp : inactiveColorProp // UI Change (2);

})

fontFamily.addEventListener("change" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);

    cellProp.fontFamily = fontFamily.value; // Change In DB
    cell.style.fontFamily = cellProp.fontFamily; // Change on UI
    fontFamily.value = cellProp.fontFamily;
})
fontSize.addEventListener("change" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);

    cellProp.fontSize = fontSize.value; // Change In DB
    cell.style.fontSize = cellProp.fontSize + "px"; // Change on UI
    fontSize.value = cellProp.fontSize;
})
fontColor.addEventListener("change" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);

    cellProp.fontColor = fontColor.value; // Change In DB
    cell.style.color = cellProp.fontColor; // Change on UI
    fontColor.value = cellProp.fontColor;
})
BGcolor.addEventListener("change" , function(e){
    let address = addressBar.value;
    let [cell , cellProp] = activeCell(address);

    cellProp.BGcolor = BGcolor.value; // Change In DB
    cell.style.backgroundColor = cellProp.BGcolor; // Change on UI
    BGcolor.value = cellProp.BGcolor;
})

for(let i = 0 ; i < alignment.length ; i++){
    alignment[i].addEventListener("click" , function(e){
        let address = addressBar.value;
        let [cell , cellProp] = activeCell(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; // Data Change
        cell.style.textAlign = cellProp.alignment; // UI change 1
        switch(alignValue){ // UI change 2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp
                break;        
        }
    })
}

let allCells = document.querySelectorAll(".cells");
for(let i = 0 ; i < allCells.length ; i++){
    eachCellProperties(allCells[i]);
}

function eachCellProperties(cell){
    cell.addEventListener("click" , function(e){
        let address = addressBar.value;
        let [rID , cID] = indexDecoder(address);
        let cellProp = sheetDB[rID][cID];
        // Apply Cell Properties
        cell.style.fontWeight = cellProp.bold === true ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic === true ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline === true ? "underline" : "none"
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor;

        // Apply UI Properties to the clicked Cell
        bold.style.backgroundColor = cellProp.bold === true ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic === true ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline === true ? activeColorProp : inactiveColorProp;
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        switch(cellProp.alignment){ // UI change 2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp
                break;        
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}



function activeCell(address){
    let [rID , cID] = indexDecoder(address);
    //Access Cell & Storage Object
    let cell = document.querySelector(`.cells[rID="${rID}"][cID="${cID}"]`);
    let cellProp = sheetDB[rID][cID];                                 
    return [cell , cellProp];
}

function indexDecoder(address){
    let rID = Number(address.slice(1)) - 1;
    let cID = Number(address.charCodeAt(0)) - 65;
    return [rID , cID];
}