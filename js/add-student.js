const form = document.querySelector(".add-student-form");
const loadingMessage = document.querySelector(".loading-dots");
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

      form.action = API_URL + "?action=add-student";
      form.method = "post";

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
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
