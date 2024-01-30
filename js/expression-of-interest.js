const loadingMessage = document.querySelector(".loading-dots");
const hiddenSection = document.querySelector(".hidden-section");

// Function to parse URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
// Get the "title" parameter from the URL
const titleValue = getURLParameter("Project_Title");
// Now you can use the "titleValue" as needed in your "expression-of-interest.html" page.
console.log("Title value from URL parameter: " + titleValue);
// Check if the titleValue is not null or undefined
if (titleValue) {
  // Display a message with the retrieved project title
  const messageElement = document.getElementById("message"); // Assuming you have an element with the id "message" on your HTML page
  if (messageElement) {
    messageElement.textContent = `You have expressed interest in the ${titleValue} Project`;
  }
} else {
  // Handle the case where the "title" parameter is not provided
  console.log("Title parameter not found in the URL.");
}

const form = document.querySelector(".add-student-form");
const errormessage = document.querySelector("#successMessage");
const hiddenSections = document.querySelectorAll(".hidden-section");

// Create separate constants for each hidden section
const section1 = hiddenSections[0]; // Access the first hidden section
const section2 = hiddenSections[1]; // Access the second hidden section
const section3 = hiddenSections[2]; // Access the third hidden section

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("uploadForm");

  //hide all the hidden sections when the user clicks on a form input field
  const inputFields = form.querySelectorAll("input, textareas"); // Get all input fields within the form
  inputFields.forEach(function (input) {
    input.addEventListener("focus", function () {
      // Hide all hidden sections when any input field is focused
      hiddenSections.forEach(function (section) {
        section.style.display = "none";
      });
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    document.getElementById("projectTitle").value = titleValue;

    uploadFile(); // Call the function to handle file upload and form submission
  });

  function uploadFile() {
    var loadingMessage = document.querySelector(".loading-dots");
    var cvUploadField = document.querySelector(".cv-upload");

    section1.style.display = "none";
    section2.style.display = "none";
    loadingMessage.style.display = "block";
    var reader = new FileReader();
    var file = cvUploadField.files[0];

    reader.onload = function () {
      document.getElementById("fileContent").value = reader.result;
      document.getElementById("filename").value = file.name;

      form.action = API_URL + "?action=expression-of-interest";
      form.method = "post";

      var formData = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          if (data === "NIC_Number already exists") {
            section1.style.display = "block";
            section2.style.display = "block";
            console.log("NIC Number already exists.");
            loadingMessage.style.display = "none";
          } else {
            console.log("Successfully Added");
            loadingMessage.style.display = "none";
            section3.style.display = "block";
            form.reset();
            // Reset Chosen.js dropdowns after form submission
            $(".chosen-select-student, .chosen-select-mentor")
              .val("")
              .trigger("chosen:updated");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      console.log("Form data sent to server");
    };

    reader.readAsDataURL(file);
  }
});

// dropdown menu js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    // var titles = JSON.parse(xhr.responseText).titles;
    var studentData = JSON.parse(xhr.responseText);
    var firstNames = studentData.firstNames;
    var lastNames = studentData.lastNames;
    var nicNumbers = studentData.nicNumbers;

    // Combine first and last names and convert to lowercase
    var fullNames = firstNames.map(function (firstName, index) {
      var fullName =
        firstName + " " + lastNames[index] + " (" + nicNumbers[index] + ")";
      return fullName.toLowerCase();
    });

    populateDropdown(fullNames, "Select1");
    populateDropdown(fullNames, "Select2");
    populateDropdown(fullNames, "Select3");
    populateDropdown(fullNames, "Select4");

    // Move Chosen initialization inside the callback
    $(".chosen-select-student").chosen({
      width: "80%",
      no_results_text: "Oops, nothing found!",
      allow_single_deselect: true,
      // max_selected_options: 4, // Set the maximum number of selections if needed
    });
  }
};
xhr.open("GET", API_URL + "?action=students-names", true);
xhr.send();

// dropdown menu js for mentor
var xhrMentor = new XMLHttpRequest();
xhrMentor.onreadystatechange = function () {
  if (xhrMentor.readyState == 4 && xhrMentor.status == 200) {
    var mentorData = JSON.parse(xhrMentor.responseText);
    var mentorFirstNames = mentorData.firstNames;
    var mentorLastNames = mentorData.lastNames;

    var mentorFullNames = mentorFirstNames.map(function (
      mentorFirstName,
      index
    ) {
      var mentorFullName = mentorFirstName + " " + mentorLastNames[index];
      return mentorFullName.toLowerCase();
    });

    populateDropdown(mentorFullNames, "Select5");

    $(".chosen-select-mentor").chosen({
      width: "80%",
      no_results_text: "Oops, nothing found!",
      allow_single_deselect: true,
    });
  }
};
xhrMentor.open("GET", API_URL + "?action=mentor-names", true); // Change the action parameter to differentiate between mentor and student
xhrMentor.send();

// Function to populate dropdown with titles
function populateDropdown(titles, targetDropdownId) {
  var select = document.getElementById(targetDropdownId);
  select.innerHTML = "";

  // Add an empty default option
  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "";
  select.add(defaultOption);

  titles.forEach(function (title) {
    var option = document.createElement("option");
    option.value = title; // Set the option value to the title
    option.text = title;
    select.add(option);
  });
}
