/*
Class: CS609
Assignment: Javascript Auto Advisor
Date: September 22, 2021
Group Members:
    Andrew Hoffman
    Austin Rice
    Manoj Thapa
*/
var columnHeader = ["Class", "Credit Hours", "Pre-Reqs","Term","Grade"]

function upload(inputData) {
    var fileUpload = inputData.files[0]
    if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        reader.onload = function (e) {
            var table = document.createElement("table");            
            table.setAttribute("id", "theTable");
            table.setAttribute("class", "table");
            var header = table.insertRow();
            for (x = 0; x < columnHeader.length; x++) {
                var hc = document.createElement("th");
                hc.innerHTML = columnHeader[x];
                header.appendChild(hc); 
            }
            var rows = e.target.result.split("\r\n");
            for (var i = 0; i < rows.length; i++) {
                var cells = rows[i].split("|");
                if (cells.length > 1) {
                    var row = table.insertRow();
                    for (var j = 0; j < cells.length; j++) {                        
                        var cell = row.insertCell();
                        if (j === 3) {                            
                            let select = setSemesterDropdowns(i, cells[j]);

                            cell.appendChild(select);
                        }
                        else if (j === 4) {
                            let select = setGradeDropdowns(i, cells[j])

                            cell.appendChild(select);
                        }
                        else {
                            cell.innerHTML = cells[j];
                        }                        
                    }
                }                
            }

            var tableDiv = document.getElementById("tableDiv");
            tableDiv.innerHTML = "";
            tableDiv.appendChild(table);

            calculate();
            updateSemesterDropdowns();
        }

        reader.readAsText(fileUpload);
    } else {
        alert("This browser does not support HTML5.");
    }
}

function updateSemesterDropdowns() {

    var table = document.getElementById('theTable');
    var semesterSelect = document.getElementById('select_sem');

    if (table === null || !semesterSelect.value || !semesterSelect.value === 0) {
        return;
    }

    for (const [index, row] of Array.from(table.rows).entries()) {
        if (index == 0) { continue; }
        var options = row.cells[3].childNodes[0];
        for (let option of options) {
            option.disabled = option.value < semesterSelect.value;
        }
    }
}

function setSemesterDropdowns(row, value) {
    var select = document.createElement("select");
    select.setAttribute("name", "semesterSelect" + row);
    select.setAttribute("id", "semesterSelect" + row);

    option = document.createElement("option");
    option.setAttribute("value", 99);
    option.innerHTML = "";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 1);
    option.innerHTML = "Spring_2022";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 2);
    option.innerHTML = "Fall_2022";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 3);
    option.innerHTML = "Spring_2023";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 4);
    option.innerHTML = "Fall_2023";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 5);
    option.innerHTML = "Spring_2024";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 6);
    option.innerHTML = "Fall_2024";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 7);
    option.innerHTML = "Spring_2025";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", 8);
    option.innerHTML = "Fall_2025";
    select.appendChild(option);                            

    var matchingOption = Array.from(select.childNodes).find(option => option.innerHTML === value);

    if(matchingOption && matchingOption.value !== '99')
    {
        select.value = matchingOption.value;
    }    

    return select;
}

function setGradeDropdowns(row, value) {
    var select = document.createElement("select");
    select.setAttribute("name", "gradeSelect" + row);
    select.setAttribute("id", "gradeSelect" + row);
    select.setAttribute("onchange", "calculate();");

    option = document.createElement("option");
    option.setAttribute("value", "");
    option.innerHTML = "";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", "A");
    option.innerHTML = "A";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", "B");
    option.innerHTML = "B";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", "C");
    option.innerHTML = "C";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", "D");
    option.innerHTML = "D";
    select.appendChild(option);

    option = document.createElement("option");
    option.setAttribute("value", "F");
    option.innerHTML = "F";
    select.appendChild(option);

    select.value = value;

    select.onchange = calculate;

    return select;
}

function calculate(){    
    var creditsAttempted = 0.0;
    var gradePoints = 0.0;

    var table = document.getElementById('theTable');

    for (const [index, row] of Array.from(table.rows).entries()) {
        if (index == 0) { continue; }
        
        let grade = row.cells[4].childNodes[0].value;

        var weight = 0;
        if (grade === "A")
            weight=4.0;
        else if (grade === "B")
            weight = 3.0
        else if (grade === "C")
            weight = 2.0
        else if (grade === "D")
            weight = 1.0
        else if (grade === "F")
            weight = 0.0
        else
            continue;

        let creditsForClass = parseFloat(row.cells[1].innerHTML);
        creditsAttempted += creditsForClass;

        gradePoints += weight * creditsForClass;
    }

    let gpa = parseFloat(gradePoints)/parseFloat(creditsAttempted);

    document.getElementById('gpa_label').innerHTML = "Student GPA: " + gpa.toFixed(2);
}

function exportTableToFile(filename) {
    var table = document.getElementById('theTable');

    if (table === null) {
        alert("There is nothing to save");
        return;
    }
    
    var retString = '';

    for (const [index, row] of Array.from(table.rows).entries()) {
        if (index == 0) { continue; }

        let classCode = row.cells[0].innerText;
        let creditHours = row.cells[1].innerText;
        let prereqs = row.cells[2].innerText;
        let semester = Array.from(row.cells[3].childNodes[0].childNodes).find(option => option.value == row.cells[3].childNodes[0].value).innerText;
        let grade = row.cells[4].childNodes[0].value;

        retString = retString.concat(`${classCode}|${creditHours}|${prereqs}|${semester}|${grade}\r\n`);
    }

    var file = new Blob([retString], {type: 'text/plain'});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = "student_info.txt";
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
    link.remove();
    window.URL.revokeObjectURL(link.href);
}