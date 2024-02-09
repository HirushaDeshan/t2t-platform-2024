const form = document.querySelector(".add-student-form");
const hiddenSection = document.querySelector(".hidden-section");
const submitButton = form.querySelector("#submit-button");
const loadingMessage = document.querySelector(".loading-dots");

// Function to parse URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
// Get the "title" parameter from the URL
const titleValue = getURLParameter("Project_Title");
// Now you can use the "titleValue" as needed in your "expression-of-interest.html" page.
console.log("Title value from URL parameter: " + titleValue);

const projectTitleInput = document.getElementById("projectTitle");
if (projectTitleInput && titleValue) {
  projectTitleInput.value = titleValue;
}

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

console.log(submitButton);
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Disable submit button
  submitButton.disabled = true;
  loadingMessage.style.display = "block";

  // Get form data
  const formData = new FormData(form);

  // Convert form data to JSON
  const json = JSON.stringify(Object.fromEntries(formData.entries()));
  console.log(json);

  // Make HTTP POST request to save project
  fetch(API_URL + "?action=eoi", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: json,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Project student eoi:", data);
      hiddenSection.style.display = "block";
    })
    .catch((error) => {
      console.error("Error saving student eoi:", error);
      // TODO: Handle error
    })
    .finally(() => {
      // Re-enable submit button
      submitButton.disabled = false;
      loadingMessage.style.display = "none";
      form.reset();
    });
});
