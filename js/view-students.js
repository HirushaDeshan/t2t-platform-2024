const projectList = document.querySelector('.project-list');


const projectsPerPage = 3;
let currentPage = 1;

let data; // Define the data variable in a wider scope

function renderProjects() {
    function toSentenceCase(text) {
      return text.replace(/\w\S*/g, function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      });
    }
    
    projectList.innerHTML = '';

    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const projectsToDisplay = data.records.slice(startIndex, endIndex);

    projectsToDisplay.forEach(project => {
    const listItem = document.createElement('li');
    listItem.classList.add('project-list-item');

    const title = document.createElement('div');
    title.classList.add('project-title');
    const fullName = toSentenceCase(project.First_Name) + ' ' + toSentenceCase(project.Last_Name);
    title.textContent = fullName;
    listItem.appendChild(title);

    const details = document.createElement('div');
    details.classList.add('project-details');

    var dateAdded = project.Date_Added; // Assuming project.Date_Added contains the date string "2023-10-18, 17.29.08"
    var dateParts = dateAdded.split(","); // Split the string at the comma
    var dateWithoutTime = dateParts[0]; // Take the first part


    const detailItems = [
      { icon: 'fas fa-tasks', label: 'Team ID', value: project.TeamID !== "" ? project.TeamID : 'Not Yest Team' },
      { icon: 'fas fa-code', label: 'University', value: toSentenceCase(project.Student_University)},
      { icon: 'fas fa-code', label: 'Degree Programme', value: toSentenceCase(project.Student_Degree) },
      { icon: 'fas fa-building', label: 'Email Address', value: project.Email.toLowerCase() },
      { icon: 'fas fa-bullseye', label: 'Joining Date', value: dateWithoutTime  },
    ];

    detailItems.forEach(item => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.innerHTML = `<i class="${item.icon}"></i>&nbsp; ${item.label}:`;
      div.appendChild(span);

      const value = document.createElement('p');
      value.innerHTML = item.value;
      div.appendChild(value);
      details.appendChild(div);
    });

    listItem.appendChild(details);
    projectList.appendChild(listItem);
  });

  renderPaginationControls(data.records.length);
}

function renderPaginationControls(totalProjects) {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderProjects();
        });
        pagination.appendChild(pageButton);
    }
}

fetch(API_URL + '?action=get-students')
    .then(response => response.json())
    .then(responseData => {
        data = responseData; // Store the data in the wider scope
        renderProjects();
    })
    .catch(error => console.error(error));