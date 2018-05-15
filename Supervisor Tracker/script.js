/*************
 * Counters
 *************/

// Primitive
var empCount = 0;
var KBCount = 0;
var completedProjects = 0;

// Objects
var projectList = Array();
var infoList = Array();

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function displayEmp() {
  if (empCount == 0) {
    console.log("empCount is 0");
    document.getElementById("showEmp").innerHTML = "I haven't helped any employees.";
  } else {
    console.log("EmpCount = "+empCount);
    document.getElementById("showEmp").innerHTML = "I helped "+empCount+" employees today!";
  }
}

function addEmployee() {   
  empCount++;
  console.log('Added Employee\n Employee = '+empCount);
  displayEmp();
}

function subEmployee() {
  if (empCount > 0) {
    empCount--;
    displayEmp();
  } else {
    alert('You have not helped anyone.');
  }
}

function clearEmp() {
  if (confirm("Are you sure you would like to reset how many employees you helped today?")) {
    empCount = 0;
  }
  displayEmp();
}

function displayKB() {
    if (KBCount == 0) {
    console.log("KBCount is 0");
    document.getElementById("showKB").innerHTML = "I haven't read any articles.";
  } else {
    console.log("KBCount = "+KBCount);
    document.getElementById("showKB").innerHTML = "I read "+KBCount+" articles today!"; 
  }
}

function addKB() {
  KBCount++;
  console.log('Added KB\n KB = '+KBCount);
  displayKB();
}

function subKB() {
  if (KBCount > 0) {
    KBCount--;
    displayKB();
  } else {
    alert('You have not read anything.');
  }
}

function clearKB() {
  if (confirm("Are you sure you would like to reset how many articles you read today?")) {
    KBCount = 0;
  }
  displayKB();
}

/***********************
 * Project funtions
 ***********************/

function validateForm() {
  let projectName = document.getElementById("projectName").value;
  let projectDes = document.getElementById("projectDes").value;
  if (projectName == "" && projectDes == "") {
      alert("You have not filled out either of the forms.");
      return false;
  }
  else if (projectName == "") {
      alert("'Project Name:' must be filled out.");
      return false;
  }
  else if (projectDes == "") {
      alert("'Project Description:' must be filled out.");
      return false;
  }

  document.getElementById("projectForm").reset();
  
  console.log("projectList is not null");
  addProject(projectName, projectDes);
}

function addProject(projectName, des) {
    var newProject = {
    projectName: projectName,
    description: des,
    isDone: false
  };
  
  if (infoList == null) {infoList = Array();}
  projectList.push(newProject);
  //unfinishedProjects.push(newProject);
  displayProjectList();
}

function displayProjectList() {
  let table = document.getElementById("projectTable");
  
  if (projectList == "") {
    console.log("There is nothing in the projectList");
    table.deleteTFoot();
  } else { // create a new row
    let footer = table.createTFoot();
    let row = footer.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = projectList[projectList.length-1].projectName;
    cell2.innerHTML = projectList[projectList.length-1].description;
    
    // select when you are done with a project
    let done = document.createElement('td');
    done.innerHTML = "No";
    done.id = "clickWhenDone";
    
    done.onclick = function () {
      console.log("trying to change done");
      let temp = done.innerHTML;
      console.log("Temp: "+temp);
      if (temp == "No") {
        console.log("changing to yes");
        done.innerHTML = "Yes";
        projectList[projectList.length-1].isDone = true;
        completedProjects++;
      } else if (temp == "Yes") {
        console.log("changeing to no");
        done.innerHTML = "No";
        projectList[projectList.length-1].isDone = false;
        completedProjects--;
      }
    }
    
    cell3.appendChild(done);
  }
}

function clearProjectList() {
  if (confirm("Are you sure you would like to reset all of your projects?")) {
    console.log("Reset the projectList");
    projectList = Array();
    displayProjectList();
  }
}

/***************
 * Info Table
 ***************/

function logInfo() {
  let Info = {
    submitDate: Date(),  // TODO simplify the date to month, day, year, and time
    emp: empCount,
    KB: KBCount,
    projects: projectList.length
  };
  
  let table = document.getElementById("infoTable");
  let footer = table.createTFoot();
  let row = footer.insertRow(0);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  cell1.innerHTML = Info.submitDate;
  cell2.innerHTML = Info.emp;
  cell3.innerHTML = Info.KB;
  cell4.innerHTML = Info.projects;

  if (infoList == null) {infoList = Array();}

  // add the object to the list
  infoList.push(Info);
  submitInfo(Info);
  
  if (confirm("Do you want to reset your daily stats? (Employees, Articles, and Projects)?")) {
    empCount = 0;
    displayEmp();
    KBCount = 0;
    displayKB();
    let table = document.getElementById("projectTable");
    table.deleteTFoot();
    projectList = Array();
  }
}

function clearInfo() {
  if (confirm("Are you sure you would like to clear your log?")) {
    let table = document.getElementById("infoTable");
    table.deleteTFoot();
    infoList = Array();
  }
}

function clearEverything() {
  if (confirm("Are you sure you would like to clear everything? You cannot get this information back.")) {
    empCount = 0;
    displayEmp();
    
    KBCount = 0;
    displayKB();
    
    let table = document.getElementById("projectTable");
    table.deleteTFoot();
    projectList = Array();
        
    table = document.getElementById("infoTable");
    table.deleteTFoot();
    infoList = Array();
  }
}

/*******************
 * Saving/Loading
 *******************/

function closingCode() {
  localStorage.setItem("empCount", empCount);
  localStorage.setItem("KBCount", KBCount);
  console.log("closed the webpage");
  
  // put projectList into storage
  localStorage.setItem('projectList', JSON.stringify(projectList));

  // Put infoList into storage
  localStorage.setItem('infoList', JSON.stringify(infoList));
  
  return null;
}

function populateTables() {
  let table = document.getElementById("projectTable");
  
  for (let i = 0; i < projectList.length; i++) {
    let footer = table.createTFoot();
    let row = footer.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = projectList[i].projectName;
    cell2.innerHTML = projectList[i].description;
    // does not insert anything in cell3
  }
  
  table = document.getElementById("infoTable");
  
  for (let i = 0; i < infoList.length; i++) {
    let footer = table.createTFoot();
    let row = footer.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerHTML = infoList[i].submitDate;
    cell2.innerHTML = infoList[i].emp;
    cell3.innerHTML = infoList[i].KB;
    cell4.innerHTML = infoList[i].projects;
  }
}

function openingCode() {
  empCount = localStorage.getItem("empCount");
  if (empCount > 0) {
    displayEmp();
  }
  
  KBCount = localStorage.getItem("KBCount");
  if (KBCount > 0) {
    displayKB();
  }
  
  //Retrieve projectList from storage
  projectList = JSON.parse(localStorage.getItem("projectList"));
  console.log('projectList: '+projectList);
  
  // Retrieve Info from storage
  infoList = JSON.parse(localStorage.getItem("infoList"));
  console.log('infoList: '+infoList);
  
  populateTables(); // put the stuff back in the tables
  
  console.log("opened the webpage");
}

/********************************************************
 * Google script to send activity log to a spreadsheet
 ********************************************************/
function submitInfo(Info) {
  var btn = document.getElementById("submitButton");
  console.log("submitInfo() function doesn't do anything");
}