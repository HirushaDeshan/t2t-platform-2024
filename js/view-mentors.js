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
    const fullName = toSentenceCase( project.Mentor_FName) + ' ' + toSentenceCase(project.Mentor_LName);
    title.textContent = fullName;
    listItem.appendChild(title);

    const details = document.createElement('div');
    details.classList.add('project-details');

    const detailItems = [
      { icon: 'fas fa-tasks', label: 'Company', value: project.Company },
      { icon: 'fas fa-code', label: "Mentor's Expertise", value: toSentenceCase(project["Mentor's_Expertise"]) },
      { icon: 'fas fa-code', label: 'Areas of Mentorship Interest', value: toSentenceCase(project.Areas_of_Mentorship_Interest) },
      { icon: 'fas fa-building', label: "Mentor's LinkedIn Profile", value: `${project["Mentor's_LinkedIn_Profile"]}` },
      { icon: 'fas fa-bullseye', label: 'Email Address', value: project.Contact_Email },
      { icon: 'fas fa-bullseye', label: 'Mobile Number', value: project.Mentor_Mobile1 },
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

fetch(API_URL + '?action=get-mentors')
    .then(response => response.json())
    .then(responseData => {
        data = responseData; // Store the data in the wider scope
        renderProjects();
    })
    .catch(error => console.error(error));