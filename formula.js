
let formulaBar = document.querySelector(".formula-bar");

for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value; 
            let [activecell, cellProp] = getCellAndCellProp(address);
            let enteredData = activecell.innerText;
              
            // if entered data is equal to cell properties then return  
            if (enteredData === cellProp) { return; }

            // Modify data in cellProp object
            cellProp.value = enteredData;
            console.log(cellProp);

            // If data modifies break p-c relation 
            removeChildFromParent(cellProp.formula);
            // Remove old formula 
            cellProp.formula = "";
            // update children cell with updated value or hardcoded value
            updateChildrenCells(address);
        })   
    }
}

formulaBar.addEventListener("keydown", (e) => {
    let inputFormula = formulaBar.value
    if (e.key === "Enter" && inputFormula){
        
        // If change in formula, break old p-c relation, evaluate new formula, add new p-c relation
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula){  removeChildFromParent(cellProp.formula);  } 


        addChildToGraphComponent(inputFormula, address); 
        // Check formula is cyclic or not, then only evaluate   
        // True -> cycle, False -> Not cyclic
        let isCyclic = isGraphCyclic(graphComponentMatrix);
        console.log(isCyclic);
        if ( isCyclic === true ){
            console.log("Cycle found");
            alert("Your graph has cycle");
            removeChildFromGraphComponent(inputFormula, address);
            return;
        }

        // first break, then evaluate
        let evaluatedValue = evaluateFormula(inputFormula);
      
        
        // To update UI and cellProp int DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        // console.log(sheetDB);

        updateChildrenCells(address);
    }
})

function addChildToGraphComponent(formula, childAddress){
   // child row id - crid, child column id - ccid  
   let [crid, ccid] = decodeRidCidFromAddress(childAddress);
   let encodedFormula = formula.split(" ");
   
   for (let i = 0; i < encodedFormula.length; i++){
       let asciiValue = encodedFormula[i].charCodeAt(0);
       if (asciiValue >= 65 && asciiValue <= 90){
           let [prid, pcid] = decodeRidCidFromAddress(encodedFormula[i]);
           // B1 : A1 + 10   
           //  rid -> i, cid -> j
           graphComponentMatrix[prid, pcid].push([crid, ccid]);
       }
   }
}

function removeChildFromGraphComponent(formula, childAddress){
    let [crid, ccid] = decodeRidCidFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
   
    for (let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90){
            let [prid, pcid] = decodeRidCidFromAddress(encodedFormula[i]);
            // B1 : A1 + 10   
            //  rid -> i, cid -> j
            // last elem will be removed
            graphComponentMatrix[prid, pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress){
     let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
     let children = parentCellProp.children;
      
    //  Apply recursive approach to update children
    // base case handled by this loop  
     for(let i = 0; i < children.length; i++){
         let childAddress = children[i];
         let [childCell, childCellProp] = getCellAndCellProp(childAddress);
         let childFormula = childCellProp.formula;

         let evaluatedValue = evaluateFormula(childFormula);
         setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
         updateChildrenCells(childAddress);
     }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90){
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }  
}

// get old formula 
function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90){
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1); // delete 1 element from index = idx
        }
    }  
}

function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90){
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
   let [cell, cellProp] = getCellAndCellProp(address);

   // UI update
   cell.innerText = evaluatedValue; 
   // DB update
   cellProp.value = evaluatedValue;  
   cellProp.formula = formula;
}

