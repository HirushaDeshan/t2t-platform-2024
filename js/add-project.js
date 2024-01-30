const form = document.querySelector(".add-project-form");
const hiddenSection = document.querySelector(".hidden-section");
const submitButton = form.querySelector(".submit-button");
const loadingMessage = document.querySelector(".loading-dots");

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
  fetch(
    API_URL + "?action=add-project",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: json,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Project saved:", data);
      hiddenSection.style.display = "block";
    })
    .catch((error) => {
      console.error("Error saving project:", error);
      // TODO: Handle error
    })
    .finally(() => {
      // Re-enable submit button
      submitButton.disabled = false;
      loadingMessage.style.display = "none";
      form.reset();
    });
});

//dropdown display in apply now button
document.addEventListener("DOMContentLoaded", function() {
  const applyButton = document.getElementById('applyButton');
  const dropdownContent = document.querySelector('.dropdown-content');

  applyButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent any other potential click events
      if (dropdownContent.style.display === 'block') {
          dropdownContent.style.display = 'none';
      } else {
          dropdownContent.style.display = 'block';
      }
  });

  // Hide dropdown if clicked outside
  document.addEventListener('click', function(event) {
      if (event.target !== applyButton) {
          dropdownContent.style.display = 'none';
      }
  });
});
