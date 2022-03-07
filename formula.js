for(let i = 0 ; i < rows ; i++){
    for(let j = 0 ; j < cols ; j++){
        let cell = document.querySelector(`.cells[rID="${i}"][cID="${j}"]`);
        cell.addEventListener("blur" , function(e){
            let address = addressBar.value;
            let[currCell , cellProp] = activeCell(address);
            let enteredData = currCell.innerText;
            let checkenteredData = (Number)(enteredData);
            let cval = (Number)(cellProp.value);
            if( checkenteredData == cval ){
                return;
            }
            cellProp.value = enteredData;  // STORAGE CHANGE
            // if data modifies remove P-C connection , formula empty and update childrens with new modified values
            console.log(address);
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
            
            // console.log(cellProp);
        })
    }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown" , async function(e){
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula != ""){
        let address = addressBar.value;
        let[cell , cellProp] = activeCell(address);
        if(inputFormula !== cellProp.formula){
            // If Change In formula break old P-C relation , evaluate new formula and establish new P-C relation
            removeChildFromParent(cellProp.formula);
        }
        addChildToGraphComponent(inputFormula , address);
        //  Check Formula if cyclic or not -> then only evaluate
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse){
            let response = confirm("Your Formula Is Cyclic.Do You Want To Trace Your Path?");
            while(response == true){
                // Keep On Tracking Color Until User Is Satisfied
                await isGraphCyclicTracePath(graphComponentMatrix , cycleResponse); 
                // I want to complete full iteration of color track and after that 
                // want alert to pop up again so i'll use await here also
                response = confirm("Your Formula Is Cyclic.Do You Want To Trace Your Path?");
            }
            removeChildFromGraphComponent(inputFormula , address);
            return;
        }
        let evaluatedValue = evaluateFormula(inputFormula);
       
        //To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue , inputFormula , address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
        // console.log(sheetDB);
    }
})

function addChildToGraphComponent(formula , childAddress){
   let [crid , ccid] = indexDecoder(childAddress);
   let encodedFormula = formula.split(" ");
   for(let i = 0 ; i < encodedFormula.length ; i++){
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if(asciiValue >= 65 && asciiValue <= 90){
        let [prid , pcid] = indexDecoder(encodedFormula[i]);
        graphComponentMatrix[prid][pcid].push([crid , ccid]);
    }
   }
}

function removeChildFromGraphComponent(formula , childAddress){
    let [crid , ccid] = indexDecoder(childAddress); // This statement is optional
    let encodedFormula = formula.split(" ");
    for(let i = 0 ; i < encodedFormula.length ; i++){
     let asciiValue = encodedFormula[i].charCodeAt(0);
     if(asciiValue >= 65 && asciiValue <= 90){
         let [prid , pcid] = indexDecoder(encodedFormula[i]);
         graphComponentMatrix[prid][pcid].pop();
     }
    }
}

function updateChildrenCells(parentAddress){
    let[parentCell , parentCellProp] = activeCell(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0 ; i < children.length ; i++){
        let childAddress =  children[i];
        let[childCell , childCellProp] = activeCell(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue , childFormula , childAddress);
        updateChildrenCells(childAddress); // recursive function for all childrens
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" "); 
    for(let i = 0 ; i < encodedFormula.length ; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell ,parentCellProp] = activeCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" "); 
    for(let i = 0 ; i < encodedFormula.length ; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [parentCell ,parentCellProp] = activeCell(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx , 1);
        }
    }
}

function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i = 0 ; i < encodedFormula.length ; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90){
            let [cell , cellProp] = activeCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue , formula , address){
    let[cell , cellProp] = activeCell(address);

    //UI Update
    cell.innerText = evaluatedValue;
    //DB Update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}