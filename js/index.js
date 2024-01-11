document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm !== '') {
        searchUsers(searchTerm);
      }
    });
  
    function searchUsers(username) {
      const apiUrl = `https://api.github.com/search/users?q=${username}`;
  
      fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => {
        displayUsers(data.items);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  
    function displayUsers(users) {
      userList.innerHTML = ''; // Clear previous results
  
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src='${user.avatar_url}' alt='${user.login}' />
          <span>${user.login}</span>
          <a href='#' data-username='${user.login}'>View Repositories</a>
        `;
        userList.appendChild(listItem);
  
        listItem.querySelector('a').addEventListener('click', function (e) {
          e.preventDefault();
          const username = this.getAttribute('data-username');
          getUserRepos(username);
        });
      });
    }
  
    function getUserRepos(username) {
      const apiUrl = `https://api.github.com/users/${username}/repos`;
  
      fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => {
        displayRepos(data);
      })
      .catch(error => console.error('Error fetching repos:', error));
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = ''; // Clear previous results
  
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
        `;
        reposList.appendChild(listItem);
      });
    }
  });
  