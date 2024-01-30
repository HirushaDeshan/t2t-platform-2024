   // Get search bar element
   var searchBar = document.getElementById("search-bar");

   // Add event listener for search bar
   searchBar.addEventListener("keyup", function () {
     // Get search query
     var query = searchBar.value.toLowerCase();

     // Get project list items
     var projectListItems =
       document.getElementsByClassName("project-list-item");

     // Loop through project list items
     for (var i = 0; i < projectListItems.length; i++) {
       // Get project text content
       var projectText = projectListItems[i].textContent.toLowerCase();

       // Check if project text content contains search query
       if (projectText.indexOf(query) > -1) {
         // Show project list item
         projectListItems[i].style.display = "";
       } else {
         // Hide project list item
         projectListItems[i].style.display = "none";
       }
     }
   });