var db = SpreadsheetApp.openByUrl(
  "https://docs.google.com/spreadsheets/d/1rAcdXdeKSOjSQ0mVAB3EVyQAmo7-IcmXM_hV_FBXFFM/edit#gid=853801378"
);
const sheet = db.getSheetByName("Projects");
var emailTo = "hirushadeshanit@gmail.com";

function doGet(req) {
  var action = req.parameter.action;
  switch (action) {
    case "get-projects":
      return ContentService.createTextOutput(
        JSON.stringify(getProjects())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    case "get-4projects":
      return ContentService.createTextOutput(
        JSON.stringify(get4Projects())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    case "get-students":
      return ContentService.createTextOutput(
        JSON.stringify(getStudents())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    case "get-mentors":
      return ContentService.createTextOutput(
        JSON.stringify(getMentors())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    case "get-project-titles": {
      // Retrieve project titles from Google Sheet and return them as JSON
      if (req.parameter.action === "get-project-titles") {
        var sheet = SpreadsheetApp.openById(
          SCRIPT_PROP.getProperty("key")
        ).getSheetByName("Students");
        var dataRange = sheet.getRange("B:B");
        var values = dataRange.getValues();
        var projectTitles = values.slice(1).map(function (row) {
          return row[0];
        });
        return ContentService.createTextOutput(
          JSON.stringify(projectTitles)
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
    case "get-mentor-list": {
      if (req.parameter.action === "get-mentor-list") {
        var sheet = SpreadsheetApp.openById(
          SCRIPT_PROP.getProperty("key")
        ).getSheetByName("Mentors");
        var dataRange = sheet.getRange("C:D");
        var values = dataRange.getValues();
        var mentorList = values.slice(1).map(function (row) {
          return row[0] + " " + row[1];
        });
        return ContentService.createTextOutput(
          JSON.stringify(mentorList)
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
    case "students-names":
      return ContentService.createTextOutput(
        JSON.stringify(getStudentNames())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    case "mentor-names":
      return ContentService.createTextOutput(
        JSON.stringify(getMentorNames())
      ).setMimeType(ContentService.MimeType.JSON);
      break;
    default:
      return ContentService.createTextOutput(
        JSON.stringify({ error: "Unknown Action" })
      ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(req) {
  var action = req.parameter.action;
  switch (action) {
    case "add-project":
      return addProject(req.postData.contents);
      break;
    case "add-student":
      {
        var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
        var sheet = doc.getSheetByName("Students");
        var headers = sheet
          .getRange(1, 1, 1, sheet.getLastColumn())
          .getValues()[0];

        var nicIndex = headers.indexOf("NIC_Number"); // Get the index of the NIC_Number column
        var nicNumbers = sheet
          .getRange(2, nicIndex + 1, sheet.getLastRow(), 1)
          .getValues(); // Get all NIC_Numbers

        var existingNIC = nicNumbers.flat().filter(String); // Flatten and filter out empty cells

        var submittedNIC = req.parameter.NIC_Number; // Get the submitted NIC_Number

        if (existingNIC.includes(submittedNIC)) {
          // NIC_Number already exists
          return ContentService.createTextOutput("NIC_Number already exists");
        } else {
          try {
            var data = req.parameter.fileContent;
            var filename = req.parameter.filename;
            var NIC_Number = req.parameter.NIC_Number;
            var First_Name = req.parameter.First_Name;
            var Last_Name = req.parameter.Last_Name;

            var result = uploadCVFileToGoogleDrive(
              data,
              filename,
              First_Name,
              Last_Name,
              NIC_Number,
              req
            );
            return ContentService.createTextOutput("Success");
          } catch (error) {
            return ContentService.createTextOutput("Fail");
          }
        }
      }
      break;
    case "add-mentor":
      return addMentor(req.postData.contents);
      break;
    case "expression-of-interest": {
      var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
      var sheet = doc.getSheetByName("Teams");
      var headers = sheet
        .getRange(1, 1, 1, sheet.getLastColumn())
        .getValues()[0];

      var nicIndex = headers.indexOf("NIC_Number"); // Get the index of the NIC_Number column
      var nicNumbers = sheet
        .getRange(2, nicIndex + 1, sheet.getLastRow(), 1)
        .getValues(); // Get all NIC_Numbers

      var existingNIC = nicNumbers.flat().filter(String); // Flatten and filter out empty cells

      var submittedNIC = req.parameter.NIC_Number; // Get the submitted NIC_Number

      if (existingNIC.includes(submittedNIC)) {
        // NIC_Number already exists
        return ContentService.createTextOutput("NIC_Number already exists");
      } else {
        try {
          var data = req.parameter.fileContent;
          var filename = req.parameter.filename;
          var NIC_Number = req.parameter.NIC_Number;
          var First_Name = req.parameter.First_Name;
          var Last_Name = req.parameter.Last_Name;

          var result = uploadProjectProposalFileToGoogleDrive(
            data,
            filename,
            First_Name,
            Last_Name,
            NIC_Number,
            req
          );
          return ContentService.createTextOutput("Success");
        } catch (error) {
          return ContentService.createTextOutput("Fail");
        }
      }
    }
    case "contact-us":
      return contactUs(req.postData.contents);
      break;
    default:
      return ContentService.createTextOutput("Unknown Action");
  }
}

//code for expression of interest page
function getStudentNames() {
  var sheetObject = db.getSheetByName("Students");
  var data = {};
  data.firstNames = _readColumnData(sheetObject, "First_Name");
  data.lastNames = _readColumnData(sheetObject, "Last_Name"); // Add last names
  data.nicNumbers = _readColumnData(sheetObject, "NIC_Number"); // Add NIC numbers
  return data;
  //  Logger.log(data);
}

function getMentorNames() {
  var sheetObject = db.getSheetByName("Mentors");
  var data = {};
  data.firstNames = _readColumnData(sheetObject, "Mentor FName");
  data.lastNames = _readColumnData(sheetObject, "Mentor LName"); // Add last names
  // data.nicNumbers = _readColumnData(sheetObject, "NIC_Number"); // Add NIC numbers
  return data;
  //  Logger.log(data);
}

function _readColumnData(sheet, columnName) {
  var data = [];
  var columnIndex = -1;

  // Find the index of the specified column
  var header = sheet.getDataRange().getValues()[0];
  for (var i = 0; i < header.length; i++) {
    if (header[i] === columnName) {
      columnIndex = i;
      break;
    }
  }

  if (columnIndex !== -1) {
    // Read data from the specified column
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      // Start from 1 to skip header
      var row = values[i];
      data.push(row[columnIndex]);
    }
  }

  return data;
  // Logger.log(data);
}

//get4projects
function get4Projects() {
  var sheetObject = db.getSheetByName("Projects");
  var data = {};
  data.records = _readLastUpdatedData(sheetObject, 4);
  //Logger.log(data);
  return data;
}

function _readLastUpdatedData(sheet, limit) {
  var data = [];
  var values = sheet.getDataRange().getValues();
  var header = values[0];
  for (var i = values.length - 1; i > 0 && data.length < limit; i--) {
    var row = values[i];
    var record = {};
    for (var j = 0; j < header.length; j++) {
      record[header[j]] = row[j];
    }
    data.push(record);
  }
  return data;
}

//add projects
function addProject(contents) {
  var project = JSON.parse(contents);
  var sheetObject = db.getSheetByName("Projects");
  var timestamp = Date.now();
  var currentTime = new Date().toLocaleString(); // Full Datetime

  var rowData = sheetObject.appendRow([
    timestamp,
    project.Title,
    project.Company,
    project.Goal,
    project.Tasks,
    project.Technology,
    project.Minimum_Team,
    currentTime,
    project.Duration,
    project.Details_Link,
    project.Contact_Phone,
    project.Contact_Email,
    project.Contact_Name,
    false,
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: project.Title })
  ).setMimeType(ContentService.MimeType.JSON);
}

var SCRIPT_PROP = PropertiesService.getScriptProperties();
var doc = SpreadsheetApp.getActiveSpreadsheet();
SCRIPT_PROP.setProperty("key", doc.getId());

function record_student_data(req, fileUrl) {
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName("Students"); //select the response sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nicIndex = headers.indexOf("NIC_Number"); // Get the index of the NIC_Number column
    var nicNumbers = sheet
      .getRange(2, nicIndex + 1, sheet.getLastRow(), 1)
      .getValues(); // Get all NIC_Numbers
    var existingNIC = nicNumbers.flat().filter(String); // Flatten and filter out empty cells
    var submittedNIC = req.parameter.NIC_Number; // Get the submitted NIC_Number

    if (existingNIC.includes(submittedNIC)) {
      // NIC_Number already exists
      return ContentService.createTextOutput("NIC_Number already exists");
    } else {
      var nextRow = sheet.getLastRow() + 1; //get next row
      var row = [new Date().toLocaleString()]; // first element in the row should always be a timestamp
      //loop through the header column
      for (var i = 1; i < headers.length; i++) {
        // Start at 1 to avoid the timestamp column
        if (headers[i].length > 0 && headers[i] == "CV") {
          row.push(fileUrl); // Add data to the row
        } else if (headers[i].length > 0) {
          row.push(req.parameter[headers[i]]);
        }
      }
      row.push("False");
      sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
      return ContentService.createTextOutput("Success Add");
    }
  } catch (error) {
    Logger.log(req);
  }
}

function uploadCVFileToGoogleDrive(
  data,
  file,
  First_Name,
  Last_Name,
  NIC_Number,
  req
) {
  try {
    var dropbox = "CV";
    var folder,
      folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    var ContentType = data.substring(5, data.indexOf(",")),
      bytes = Utilities.base64Decode(data.substr(data.indexOf("base64,") + 7)),
      blob = Utilities.newBlob(bytes, ContentType, file);
    var file = folder
      .createFolder([First_Name, Last_Name, NIC_Number].join("-"))
      .createFile(blob);
    var fileUrl = file.getUrl();

    record_student_data(req, fileUrl);
    return file.getUrl();
  } catch (error) {
    Logger.log(req);
  }
}

//add mentors
function addMentor(contents) {
  var project = JSON.parse(contents);
  var sheetObject = db.getSheetByName("Mentors");
  var sheetData = sheetObject.getDataRange().getValues();
  var nicIndex = 1; // Assuming NIC is in the second column (0-based index)

  // Check for duplicate NIC
  for (var i = 1; i < sheetData.length; i++) {
    // Start from row 1 (skipping headers)
    if (sheetData[i][nicIndex] === project.NIC) {
      return ContentService.createTextOutput(
        JSON.stringify({ error: "NIC number already exists" })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  var timestamp = Date.now();
  var currentTime = new Date().toLocaleString(); // Full Datetime

  var rowData = sheetObject.appendRow([
    timestamp,
    project.NIC,
    project.FName,
    project.Lname,
    project.Mobile1,
    project.Mobile2,
    project.Email,
    project.LinkedIn,
    project.Company,
    project.Industry,
    project.Interest_Area,
    currentTime,
    false,
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: project.FName })
  ).setMimeType(ContentService.MimeType.JSON);
}

//get all projects
function getProjects() {
  var sheetObject = db.getSheetByName("Projects");
  var data = {};

  data.records = _readData(sheetObject);

  return data;
  //Logger.log(data);
}

function _readData(sheetObject, properties) {
  if (typeof properties == "undefined") {
    properties = _getHeaderRow(sheetObject);
    properties = properties.map(function (p) {
      return p.replace(/\s+/g, "_");
    });
  }

  var rows = _getDataRows(sheetObject),
    data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row = rows[r],
      record = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }

    if (record["Active"]) {
      data.push(record);
    }
  }

  return data;
}

function _getDataRows(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}
function _getHeaderRow(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

//get students data
function getStudents() {
  var sheetObject = db.getSheetByName("Students");
  var data = {};

  data.records = _readDataS(sheetObject);

  return data;
  //Logger.log(data);
}

function _readDataS(sheetObject, properties) {
  if (typeof properties == "undefined") {
    properties = _getHeaderRowS(sheetObject);
    properties = properties.map(function (p) {
      return p.replace(/\s+/g, "_");
    });
  }

  var rows = _getDataRowsS(sheetObject),
    data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row = rows[r],
      record = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }

    if (record["Active"]) {
      data.push(record);
    }
  }
  return data;
}

function _getDataRowsS(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}
function _getHeaderRowS(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

//get mentors data
function getMentors() {
  var sheetObject = db.getSheetByName("Mentors");
  var data = {};

  data.records = _readDataM(sheetObject);

  return data;
  //Logger.log(data);
}

function _readDataM(sheetObject, properties) {
  if (typeof properties == "undefined") {
    properties = _getHeaderRowM(sheetObject);
    properties = properties.map(function (p) {
      return p.replace(/\s+/g, "_");
    });
  }

  var rows = _getDataRowsM(sheetObject),
    data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row = rows[r],
      record = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }

    if (record["Active"]) {
      data.push(record);
    }
  }

  return data;
}

function _getDataRowsM(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}
function _getHeaderRowM(sheetObject) {
  var sh = sheetObject;

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

//contact us and get email
function contactUs(contents) {
  var project = JSON.parse(contents);
  var sheetObject = db.getSheetByName("Contact Us");
  var timestamp = Date.now();
  var currentTime = new Date().toLocaleString(); // Full Datetime

  var rowData = sheetObject.appendRow([
    timestamp,
    project.Name,
    project.Email,
    project.Mobile,
    project.Message,
    currentTime,
    false,
  ]);

  function toSentenceCase(text) {
    return text.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }

  var name = project.Name;
  var sentenceCaseName = toSentenceCase(name);

  // Create the email content
  var emailContent =
    toSentenceCase(project.Name) +
    " Contact Us:\n" +
    "Name: " +
    project.Name +
    "\n" +
    "Email Address: " +
    project.Email +
    "\n" +
    "Mobile: " +
    project.Mobile +
    "\n" +
    "Message: " +
    project.Message;

  // Send the email
  MailApp.sendEmail({
    to: emailTo, // Replace with the recipient's email address
    subject: "New User Contact Us",
    body: emailContent,
  });

  return ContentService.createTextOutput(
    JSON.stringify({ success: project.Title })
  ).setMimeType(ContentService.MimeType.JSON);
}

//add expression of interest code
var SCRIPT_PROP = PropertiesService.getScriptProperties();
var doc = SpreadsheetApp.getActiveSpreadsheet();
SCRIPT_PROP.setProperty("key", doc.getId());

function record_data(req, fileUrl) {
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName("Teams"); //select the response sheet

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; //get next row
    var row = [new Date().toLocaleString()]; // first element in the row should always be a timestamp
    //loop through the header column
    for (var i = 1; i < headers.length; i++) {
      // Start at 1 to avoid the timestamp column
      if (headers[i].length > 0 && headers[i] == "Proposal") {
        row.push(fileUrl); // Add data to the row
      } else if (headers[i].length > 0) {
        // Add data to the row based on the header name
        if (headers[i] === "Project_Title") {
          row.push(req.parameter.Project_Title); // Add the title parameter
        } else if (headers[i] === "member1Title") {
          row.push(req.parameter.member1Title); // Add the member1Title parameter
        } else if (headers[i] === "member2Title") {
          row.push(req.parameter.member2Title); // Add the member2Title parameter
        } else if (headers[i] === "member3Title") {
          row.push(req.parameter.member3Title); // Add the member3Title parameter
        } else if (headers[i] === "member4Title") {
          row.push(req.parameter.member4Title); // Add the member4Title parameter
        } else if (headers[i] === "mentor") {
          row.push(req.parameter.mentor); // Add the member4Title parameter
        } else {
          row.push(req.parameter[headers[i]]);
        }
      }
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  } catch (error) {
    Logger.log(req);
  } finally {
    return;
  }
}

function uploadFileToGoogleDrive(data, file, Student_Name, NIC_Number, req) {
  try {
    var dropbox = "PDF";
    var folder,
      folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    var ContentType = data.substring(5, data.indexOf(",")),
      bytes = Utilities.base64Decode(data.substr(data.indexOf("base64,") + 7)),
      blob = Utilities.newBlob(bytes, ContentType, file);
    var file = folder
      .createFolder([Student_Name, NIC_Number].join("-"))
      .createFile(blob);
    var fileUrl = file.getUrl();

    var html =
      "<body>" +
      "<h2> Expression of Interest : " +
      req.parameters.Project_Title +
      "</h2>" +
      "<p>Student Name : " +
      req.parameters.Student_Name +
      "</p>" +
      "<p>NIC Number : " +
      req.parameters.NIC_Number +
      "</p>" +
      "<p>Contact : " +
      req.parameters.Contact +
      "</p>" +
      "<p>Team Name : " +
      req.parameters.Team_Name +
      "</p>" +
      "<p>Email Address : " +
      req.parameters.Email_Address +
      "</p>" +
      "<p>Mentor : " +
      req.parameters.mentor +
      "</p>" +
      "<p>File Name : " +
      req.parameters.filename +
      "</p>" +
      "<p><a href = " +
      file.getUrl() +
      ">Project Proposal</a></p><br />" +
      "</body>";

    record_data(req, fileUrl);

    MailApp.sendEmail(
      emailTo,
      "New Expression of Interest Recieved",
      "New Expression of Interest Request Recieved",
      { htmlBody: html }
    );
    return file.getUrl();
  } catch (error) {
    Logger.log(req);
  }
}

//code for expression of interest page

function record_teams_data(req, fileUrl) {
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName("Teams"); //select the response sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nicIndex = headers.indexOf("NIC_Number"); // Get the index of the NIC_Number column
    var nicNumbers = sheet
      .getRange(2, nicIndex + 1, sheet.getLastRow(), 1)
      .getValues(); // Get all NIC_Numbers
    var existingNIC = nicNumbers.flat().filter(String); // Flatten and filter out empty cells
    var submittedNIC = req.parameter.NIC_Number; // Get the submitted NIC_Number

    if (existingNIC.includes(submittedNIC)) {
      // NIC_Number already exists
      return ContentService.createTextOutput("NIC_Number already exists");
    } else {
      var nextRow = sheet.getLastRow() + 1; //get next row
      var row = [new Date().toLocaleString()]; // first element in the row should always be a timestamp
      //loop through the header column
      for (var i = 1; i < headers.length; i++) {
        // Start at 1 to avoid the timestamp column
        if (headers[i].length > 0 && headers[i] == "Proposal") {
          row.push(fileUrl); // Add data to the row
        } else if (headers[i].length > 0) {
          row.push(req.parameter[headers[i]]);
        }
      }
      row.push("False");
      sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
      return ContentService.createTextOutput("Success Add");
    }
  } catch (error) {
    Logger.log(req);
  }
}

function uploadProjectProposalFileToGoogleDrive(
  data,
  file,
  First_Name,
  Last_Name,
  NIC_Number,
  req
) {
  try {
    var dropbox = "Proposal";
    var folder,
      folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }
    var ContentType = data.substring(5, data.indexOf(",")),
      bytes = Utilities.base64Decode(data.substr(data.indexOf("base64,") + 7)),
      blob = Utilities.newBlob(bytes, ContentType, file);
    var file = folder
      .createFolder([First_Name, Last_Name, NIC_Number].join("-"))
      .createFile(blob);
    var fileUrl = file.getUrl();

    //send mail part
    var html =
      "<body>" +
      "<h2> Expression of Interest : " +
      req.parameters.Project_Title +
      "</h2>" +
      "<p>Student Name : " +
      req.parameters.First_Name +
      " " +
      req.parameters.Last_Name +
      "</p>" +
      "<p>NIC Number : " +
      req.parameters.NIC_Number +
      "</p>" +
      "<p>Contact : " +
      req.parameters.Contact +
      "</p>" +
      "<p>Team Name : " +
      req.parameters.Team_Name +
      "</p>" +
      "<p>Email Address : " +
      req.parameters.Email_Address +
      "</p>" +
      "<p>Student Member Names : " +
      req.parameters.Member_1 +
      ", " +
      req.parameters.Member_2 +
      ", " +
      req.parameters.Member_3 +
      ", " +
      req.parameters.Member_4 +
      "</p>" +
      "<p>Mentor : " +
      req.parameters.Mentor +
      "</p>" +
      "<p>File Name : " +
      req.parameters.filename +
      "</p>" +
      "<p><a href = " +
      file.getUrl() +
      ">Project Proposal</a></p><br />" +
      "</body>";

    MailApp.sendEmail(
      emailTo,
      "New Expression of Interest Recieved",
      "New Expression of Interest Request Recieved",
      { htmlBody: html }
    );

    record_teams_data(req, fileUrl);
    return file.getUrl();
  } catch (error) {
    Logger.log(req);
  }
}
