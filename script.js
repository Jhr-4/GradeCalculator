
window.onload = function(){
    updateForm();
    if(localStorage.getItem("currentClass") === null ){
        localStorage.setItem("currentClass", "class1");
    }
    loadButtons()
};

function visibleWeight(){
    document.querySelector('#settingsPopup').style.visibility = 'visible';
}

function invisibleWeight(){
    document.querySelector('#settingsPopup').style.visibility = 'hidden';
}

function helpPopup(){
    let popup = document.querySelector('#helpPopup');
    if (popup.style.display === 'block') {
        popup.style.display = 'none'
    } else {
        popup.style.display = 'block'
    }
}

function addWeight() {
    let WT = document.querySelector("#weightsTable")
    let currentHTML = document.querySelector("#currentWTRow").innerHTML;
    WT.insertAdjacentHTML('beforeend', `${currentHTML}`);
}



function addCTRow() {
    let CT = document.querySelector("#calcTable");
    let currentHTML = document.querySelector("#currentCTRow").innerHTML;
    CT.insertAdjacentHTML('beforeend', `${currentHTML}`);
}

function nameUpdateInput(input){
    document.querySelector('#inputClassName').value = `${input}`;
    nameUpdate();
}

function nameUpdate(){
    let className = document.querySelector('#className');
    let inputClassName = document.querySelector('#inputClassName').value;
    className.innerHTML = inputClassName;
    document.querySelector('#'+localStorage.getItem('currentClass')).innerText = inputClassName;
    stoButtons();
}

function clearCTTable() {
    let CT = document.querySelector('#calcTable');
    CT.innerHTML = `
        <tr id="currentCTRow">
        <td>
            <select name="weightInputCT" class="selectWeight">
                <option value="0">Select Weight</option>
            </select>
        </td>
        <td><input name="gradeInput" type="number" placeholder="Grade %"  min="0" max="100"></td>
        </tr>
        <tr>
            <td>
                <select name="weightInputCT" class="selectWeight">
                    <option value="0">Select Weight</option>
                </select>
            </td>
            <td><input name="gradeInput" type="number" placeholder="Grade %"  min="0" max="100"></td>
        </tr>
        <tr>
            <td>
                <select name="weightInputCT" class="selectWeight">
                    <option value="0">Select Weight</option>
                </select>
            </td>
            <td><input name="gradeInput" type="number" placeholder="Grade %"  min="0" max="100"></td>
        </tr>
        <tr>
            <td>
                <select name="weightInputCT" class="selectWeight">
                    <option value="0">Select Weight</option>
                </select>
            </td>
            <td><input name="gradeInput" type="number" placeholder="Grade %"  min="0" max="100"></td>
        </tr>`;
    localStorage.removeItem('stoCTData');
    saveClose();
    storeUpdate();
}

function clearWTTable() {
    let WT = document.querySelector('#weightsTable');
    WT.innerHTML = `
        <tr id="currentWTRow"">
            <td>
            <input type="text" class="inputNames" placeholder="Weight Category Name">
            </td>
            <td>
            <input type="number" class="weightInput" placeholder="Weight %" min="0" max="100">
            </td>
        </tr>
        <tr>
            <td>
            <input type="text" class="inputNames" placeholder="Weight Category Name">
            </td>
            <td>
            <input type="number" class="weightInput" placeholder="Weight %" min="0" max="100">
            </td>
        </tr>
        <tr>
            <td>
            <input type="text" class="inputNames" placeholder="Weight Category Name">
            </td>
            <td>
            <input type="number" class="weightInput" placeholder="Weight %" min="0" max="100">
            </td>
        </tr>`;

    localStorage.removeItem('stoWTData')
    change = 'false'
}

let change = 'false';

function detectChange(){
    change = 'true';
}

function saveClose(){
    if (change === 'true') {
        let weightInputs = document.getElementsByClassName('weightInput');
        let nameList = document.getElementsByClassName('inputNames')
        let selectList = document.getElementsByClassName('selectWeight');
        let sum = 0;
        for (let i=0; i<weightInputs.length; i++) {
            sum += parseInt(weightInputs[i].value) || 0;
        }

        if (sum == 100){
            invisibleWeight();
            let formattedNameList = []
            let formattedWeightInputs = []
            for (let i=0; i<weightInputs.length; i++) {
                    formattedNameList.push(nameList[i].value)
                    formattedWeightInputs.push(weightInputs[i].value)
            }
            //STORING WEIGHTS
            localStorage.setItem('stoWTData', `${formattedNameList}|${formattedWeightInputs}`)
            //UPDATING CURRENT SELECT OPTIONS
            for (let i=0; i<selectList.length; i++){
                selectList[i].options.length = 1;
        
                for (let i2=0; i2<weightInputs.length; i2++) {
                    if (weightInputs[i2].value > 0) {
                        selectList[i].innerHTML += `<option id="${i2}" value="${formattedWeightInputs[i2]}">${formattedNameList[i2]} ${formattedWeightInputs[i2]}%</option>`;}
                }
            };
        } else {
            alert('Sum of weights must be 100%.\nCurrently the sum is: ' + sum + '%');
        }
    } else {
        invisibleWeight();
    }
}


function backgroundClicked(event) {
    if (event.target.id === 'settingsPopup') {
        saveClose();
    }
}

function calculate(){
    let CT = document.querySelector("#calcTable"); // CT = Table's Body
    let rows = CT.rows; 
    let grades = []
    let weightID = [] // weight, uniqueID
    for (let i=0; i<rows.length; i++) {
        let grade = parseFloat(rows[i].querySelector('input').value);
        let weight = parseFloat(rows[i].querySelector('select').value);
        let uniqueID = rows[i].querySelector('select option:checked').id;
        if(grade >= 0 && weight > 0){
            grades.push(grade);
            weightID.push(`${weight}, ${uniqueID}`);
            };
        }

    let repeats = {} // 'weight, id : #occurence'
    for (let i=0; i<weightID.length; i++){
        if (repeats[weightID[i]] >= 1){
            repeats[weightID[i]] += 1;
        }else{
            repeats[weightID[i]] = 1;
        }
    };

    actualWeightID = {}; //divide weight by #occurence = avgWeight
    for (let i=0; i<Object.keys(repeats).length; i++){
        let currentKey = Object.keys(repeats)[i];
        let formatted = currentKey.split(',');
        let weight = parseFloat(formatted[0]);
        let id = parseFloat(formatted[1]);
        let avgWeight = weight / repeats[currentKey]
        actualWeightID[[avgWeight, id]] = `${weight}, ${id}`;  // {avgWeight, id : givenWeight, id}
    };

    for (let i=0; i<Object.keys(actualWeightID).length; i++) {
        //KEY
        let currentKey = Object.keys(actualWeightID)[i];
        //VALUE
        let currentValue = actualWeightID[currentKey];
        //Replacing Weights w/ avgWeight
        weightID.forEach(pair => {
            let index = weightID.indexOf(currentValue);
            if (pair == currentValue){
                weightID[index] = currentKey; //Now weightsID array = 'avgWeight, ID'
            }  
        });
    };
    
    let totalGrade=0;
    let weightSum = 0;
    //Total Grade
    for (let i=0; i<grades.length; i++){
        let formatted = weightID[i].split(',')
        let currentWeight = formatted[0]
        weightSum += currentWeight/100
        totalGrade += (grades[i]*(currentWeight/100));
    }; 

    let currentGrade = 0;  
    //Current Grade
    for (let i=0; i<grades.length; i++){
        let formatted = weightID[i].split(',');
        let currentWeight = formatted[0];
        currentGrade += (grades[i]*(currentWeight/100)) / weightSum;
    }

    //Total Grade
    /*
    let displayTotalGrade = document.querySelector('#displayTotalGrade');
    displayTotalGrade.innerHTML = `${totalGrade.toFixed(2)}%`;
    */
   
    //Current Grade
    let displayCurrentGrade = document.querySelector('#displayCurrentGrade');
    displayCurrentGrade.innerHTML = `${currentGrade.toFixed(2)}%`;
}



function storeUpdate() {
    let CT = document.querySelector("#calcTable"); // CT = Table's Body
    let rows = CT.rows; 
    //Title
    let title = document.querySelector('#inputClassName').value
    // GRADE INPUTS
    let inputs = document.getElementsByName("gradeInput"); // All gradeInputs 
    let inputGrades = []; 
    // WEIGHTS SELECTED
    let selected = document.getElementsByName("weightInputCT")
    selectedWeights = [];

    for (let i=0; i<rows.length; i++) {
        inputGrades.push(inputs[i].value);
        selectedWeights.push(selected[i].value);
    };
    localStorage.setItem('stoCTData', `${inputGrades}|${selectedWeights}|${title}`);
}




function updateForm() {
    //Updates WT TABLE
    let stoWTData = localStorage.getItem('stoWTData')
    if (stoWTData != null) {
        stoWTData = stoWTData.split('|')
        let stoNameList = stoWTData[0].split(',');
        let stoWeightInputs = stoWTData[1].split(',')
        for (let i=0; i<(stoNameList.length -3); i++){
            addWeight();
        }
        for (i=0; i<document.getElementsByClassName('weightInput').length; i++) {
            document.getElementsByClassName("weightInput")[i].value = stoWeightInputs[i];
            document.getElementsByClassName("inputNames")[i].value = stoNameList[i];
        }
        change = 'true'
        saveClose()
    }

//Updates CT TABLE
    let stoCTData = localStorage.getItem('stoCTData');
    if (stoCTData != null) {
            stoCTData = stoCTData.split('|');
        
        let stoGrades = stoCTData[0].split(',');
        let stoSelected = stoCTData[1].split(',');
        let stoTitle = stoCTData[2]
        for (let i=0; i<(stoSelected.length -4); i++) { // Run length of stoSelected minus 4 (the default amount of rows)
            addCTRow();
        }

        for (let i=0; i<document.getElementsByName("gradeInput").length; i++){
            document.getElementsByName("gradeInput")[i].value = stoGrades[i];
            document.getElementsByName("weightInputCT")[i].value = stoSelected[i];};

        document.getElementById("className").innerHTML = stoTitle;
        document.getElementById("inputClassName").value = stoTitle;
        }

    calculate()
}

function stoDataCopy(currentCTData, currentWTData){
    let currentClassID = localStorage.getItem('currentClass');
    localStorage.setItem(currentClassID, [currentCTData + ";" +currentWTData]); //stores class data as key classID
    localStorage.removeItem('stoCTData'); 
    localStorage.removeItem('stoWTData');
}

function newClass(){
    //unselected color
    currentClassID = localStorage.getItem('currentClass');
    document.getElementById(currentClassID).style.backgroundColor = '#4c3f3a';

    //storing the current data
    let currentCTData = localStorage.getItem('stoCTData');
    let currentWTData = localStorage.getItem('stoWTData');

    stoDataCopy(currentCTData, currentWTData);

    //clearing current tables
    clearCTTable();
    clearWTTable();


    //class#
    let addingClassDiv = document.getElementById("addingClass");
    let classNum = ((addingClassDiv.getElementsByTagName("td")).length); //length is with + button which makes it +1 each time

    //creating new button with id of class#
    (document.getElementById("displayClassRow")).insertAdjacentHTML('afterbegin', `<td><button onclick="openClass(event.target.id)" id="class${classNum}" class="buttonClass">unnamed</button></td>`);

    //changing currentClass to class#
    localStorage.setItem('currentClass', "class"+classNum);

    stoButtons();

    //selection new color
    document.getElementById(`class${classNum}`).style.backgroundColor = '#634e48';

    //clear name
    nameUpdateInput("unnamed");
    storeUpdate();
}

function openClass(clickedClassID){
    //unselected color
    currentClassID = localStorage.getItem('currentClass');
    document.getElementById(currentClassID).style.backgroundColor = '#4c3f3a';
    //selection new color
    document.getElementById(clickedClassID).style.backgroundColor = '#634e48';


    //storing the class that was open
    let currentCTData = localStorage.getItem('stoCTData');
    let currentWTData = localStorage.getItem('stoWTData');

    stoDataCopy(currentCTData, currentWTData);

    
    //clear current tables
    clearWTTable();
    clearCTTable();

    //retreving the data of clicked class and updating form
    let newData = localStorage.getItem(clickedClassID);

    if((newData.split(';')[0] !== 'null')){             //CTData null Empty fix
        localStorage.setItem('stoCTData', newData.split(';')[0]);
    }

    if((newData.split(';')[1] !== 'null')){             //WTData null Empty fix
        localStorage.setItem('stoWTData',newData.split(';')[1]);
    }

    updateForm();
    //delete the localStorage thats split
    localStorage.removeItem(clickedClassID);

    //setting new currentClass
    localStorage.setItem('currentClass', clickedClassID);

}

function stoButtons(){
    //sets the button names in local storage
    let PLUS_BUTTON = 1;
    let classesCols = document.getElementById("displayClassRow").getElementsByTagName("td");
    let classNames = []
    for(let i=0; i<classesCols.length - PLUS_BUTTON; i++){
        let buttonName = classesCols[i].getElementsByTagName("button")[0].innerText;
        classNames.push(buttonName);
    }
    localStorage.setItem('classNames', classNames)
}


    //for ammount of names create a button, for each button update name

function loadButtons(){
    let classStr = localStorage.getItem('classNames');
    if(classStr == '' || classStr == null){
        return;
    }
    classesArray = classStr.split(',');
    //2; because 1 button is preloaded and due to + button
    for (let classNum=2; classNum<=classesArray.length; classNum++){
        document.getElementById("displayClassRow").insertAdjacentHTML('afterbegin', `<td><button onclick="openClass(event.target.id)" id="class${classNum}" class="buttonClass">unnamed</button></td>`);
    }
    reversedClassesArray = classesArray.reverse();
    for (let i=0; i<reversedClassesArray.length; i++){
        document.getElementById(`class${i+1}`).innerText = reversedClassesArray[i];
    }

    currentClassID = localStorage.getItem('currentClass');
    document.getElementById(currentClassID).style.backgroundColor = '#634e48';
}

//J