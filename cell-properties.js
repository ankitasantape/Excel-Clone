// Storage
let sheetDB = [];  // 2D Matrix

// add cell-rows, cell-cols, cell-prop dynamically
for(let i = 0; i < rows; i++){
    let sheetRow = [];
    for(let j = 0; j < cols; j++){
        let cellProp = {
             bold       : false,
             italic     : false,
             underline  : false,
             alignment  : "left",
             fontFamily : "monospace",
             fontSize   : "14",
             fontColor  : "#000000",
             BGcolor    : "#000000", // used for indication purpose default value
             value      : "",       // integer value entered by user
             formula    : "",
             children   : [],
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}

// Selectors for cell properties
let bold            = document.querySelector(".bold");  
let italic          = document.querySelector(".italic");  
let underlined      = document.querySelector(".underlined");  
let fontSize        = document.querySelector(".font-size-prop");  
let fontFamily      = document.querySelector(".font-family-prop");  
let fontColor       = document.querySelector(".font-color-prop"); 
let backgroundColor = document.querySelector(".background-color-prop"); 
let alignment       = document.querySelectorAll(".alignment");
let leftAlign       = alignment[0]; // left alignment
let centerAlign     = alignment[1]; // center alignment
let rightAlign      = alignment[2]; // right alignment
let justifyAlign    = alignment[3]; // justify alignment


// let addressBar = document.querySelector(".address-bar");
let activeColorProp   = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// Application of two-way binding
// attach property listener
// Bold
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.bold = !cellProp.bold; // data changed in storage
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // data UI changed (1) 
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // data UI changed (2) 
})

// Italic
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.italic = !cellProp.italic; // data changed in storage
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // data UI changed (1) 
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // data UI changed (2) 
})

// Italic
underlined.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.underlined = !cellProp.underlined; // data changed in storage
    cell.style.textDecoration = cellProp.underlined ? "underline" : "none"; // data UI changed (1) 
    underlined.style.backgroundColor = cellProp.underlined ? activeColorProp : inactiveColorProp; // data UI changed (2) 
})

// FontSize
fontSize.addEventListener("change", (e) => {
    let address          = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.fontSize   = fontSize.value; // data changed in storage
    cell.style.fontSize = cellProp.fontSize + "px"; // data UI changed (1) 
    fontSize.value      = cellProp.fontSize; // data UI changed (2) 
})

// FontFamily
fontFamily.addEventListener("change", (e) => {
    let address          = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.fontFamily   = fontFamily.value; // data changed in storage
    cell.style.fontFamily = cellProp.fontFamily; // data UI changed (1) 
    fontFamily.value = cellProp.fontFamily; // data UI changed (2) 
})

// FontColor
fontColor.addEventListener("change", (e) => {
    let address          = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.fontColor = fontColor.value; // data changed in storage
    cell.style.color   = cellProp.fontColor; // data UI changed (1) 
    fontColor.value    = cellProp.fontColor; // data UI changed (2) 
})

// BackgroundColor
backgroundColor.addEventListener("change", (e) => {
    let address          = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address)
    
    // Modification
    // toggle true/false
    cellProp.BGcolor   = backgroundColor.value; // data changed in storage
    cell.style.backgroundColor = cellProp.BGcolor; // data UI changed (1) 
    backgroundColor.value      = cellProp.BGcolor; // data UI changed (2) 
})

// Alignment
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address          = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        
        // jisape bhi trigger hua hai us target ki classList me se first class ki value get hogi
        let alignValue       = e.target.classList[0];
        cellProp.alignment   = alignValue; // data changed in storage
        cell.style.textAlign = cellProp.alignment; // data UI changed (1) 

        switch(alignValue){ // data UI changed (2) 
            case "left":
                leftAlign.style.backgroundColor    = activeColorProp; // data UI changed (2)
                rightAlign.style.backgroundColor   =  inactiveColorProp; 
                justifyAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor  = inactiveColorProp;
                break;
            case "right":  
                rightAlign.style.backgroundColor   = activeColorProp; // data UI changed (2) 
                justifyAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor  = inactiveColorProp;
                leftAlign.style.backgroundColor    = inactiveColorProp;
                break;
            case "justify":
                justifyAlign.style.backgroundColor = activeColorProp; // data UI changed (2) 
                centerAlign.style.backgroundColor  = inactiveColorProp;
                leftAlign.style.backgroundColor    = inactiveColorProp;
                rightAlign.style.backgroundColor   = inactiveColorProp; 
                break;
            case "center":
                centerAlign.style.backgroundColor  = activeColorProp; // data UI changed (2) 
                leftAlign.style.backgroundColor    = inactiveColorProp; // data UI changed (2)
                rightAlign.style.backgroundColor   =  inactiveColorProp; 
                justifyAlign.style.backgroundColor = inactiveColorProp;
                break;
        }
    })
})

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++){
    // 1D array me loop chalega every cell pe (0 to (n*n - 1)) tk
    addListenerToAttachCellProperties(allCells[i]);
}
// 
function addListenerToAttachCellProperties(cell){
    // Work
     cell.addEventListener("click", (e) => {
        let address    = addressBar.value;
        let [rid, cid] = decodeRidCidFromAddress(address);
        let cellProp   = sheetDB[rid][cid];

        // Apply cell Properties 
        cell.style.fontWeight      = cellProp.bold       ? "bold"      : "normal";
        cell.style.fontStyle       = cellProp.italic     ? "italic"    : "normal";
        cell.style.textDecoration  = cellProp.underlined ? "underline" : "none";
        cell.style.fontSize        = cellProp.fontSize + "px";
        cell.style.fontFamily      = cellProp.fontFamily;
        cell.style.color           = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent" : cellProp.backgroundColor;
        cell.style.textAlign       = cellProp.alignment;
        

        // Apply Properties(will displays on icons) to UI Prop container
        bold.style.backgroundColor       = cellProp.bold       ? activeColorProp : inactiveColorProp; 
        italic.style.backgroundColor     = cellProp.italic     ? activeColorProp : inactiveColorProp; 
        underlined.style.backgroundColor = cellProp.underlined ? activeColorProp : inactiveColorProp; // data UI changed (2) 
        fontColor.value                  = cellProp.fontColor;
        backgroundColor.value            = cellProp.BGcolor; 
        fontSize.value                   = cellProp.fontSize;
        fontFamily.value                 = cellProp.fontFamily;
        switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor    = activeColorProp; 
                rightAlign.style.backgroundColor   = inactiveColorProp; 
                justifyAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor  = inactiveColorProp;
                break;
            case "right":  
                rightAlign.style.backgroundColor   = activeColorProp;  
                justifyAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor  = inactiveColorProp;
                leftAlign.style.backgroundColor    = inactiveColorProp;
                break;
            case "justify":
                justifyAlign.style.backgroundColor = activeColorProp;  
                centerAlign.style.backgroundColor  = inactiveColorProp;
                leftAlign.style.backgroundColor    = inactiveColorProp;
                rightAlign.style.backgroundColor   = inactiveColorProp; 
                break;
            case "center":
                centerAlign.style.backgroundColor  = activeColorProp; 
                leftAlign.style.backgroundColor    = inactiveColorProp; 
                rightAlign.style.backgroundColor   = inactiveColorProp; 
                justifyAlign.style.backgroundColor = inactiveColorProp;
                break;
        }
        
        let formulaBar = document.querySelector(".formula-bar"); 
        formulaBar.value = cellProp.formula;
        cell.value = cellProp.value;
     })
}

function getCellAndCellProp(address){
    // Decode rid and cid address
    let [rid, cid] = decodeRidCidFromAddress(address);
    // Access cell & storage object
    // to access attribute of cell class from UI
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    // to access rid and cid of cell from database
    let cellProp = sheetDB[rid][cid];
    // cell help to change data in UI
    // cellProp help to change data of cellobj in database
    // this is known as two way binding
    return [cell, cellProp];
}

function decodeRidCidFromAddress(address){
    // address -> "A1", in matrix[0][0] 
    let rid = Number(address.slice(1) - 1); //"1" -> 1, "1" - 1 = 0,   A1 me se 1 ki value aa jayegi
    let cid = Number(address.charCodeAt(0)) - 65; // "A" -> 65,   "A" - 65 = 65 - 65 = 0
    return [rid, cid];
}