document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const searchTypeButton = document.getElementById('search-type-button');
  
    let currentSearchType = 'user'; // Default to searching for users
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm !== '') {
        if (currentSearchType === 'user') {
          searchUsers(searchTerm);
        } else if (currentSearchType === 'repo') {
          searchRepos(searchTerm);
        }
      }
    });
  
    searchTypeButton.addEventListener('click', function () {
      // Toggle between 'user' and 'repo' search types
      currentSearchType = currentSearchType === 'user' ? 'repo' : 'user';
  
      // Update the placeholder text for the search input based on the current search type
      searchInput.placeholder = currentSearchType === 'user' ? 'Search for Users' : 'Search for Repositories';
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
  
    function searchRepos(keyword) {
      const apiUrl = `https://api.github.com/search/repositories?q=${keyword}`;
  
      fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => {
        displayRepos(data.items);
      })
      .catch(error => console.error('Error fetching repos:', error));
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
        openUserReposPage(username);
      })
      .catch(error => console.error('Error fetching repos:', error));
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
  
    function openUserReposPage(username) {
      window.open(`https://github.com/${username}?tab=repositories`, '_blank');
    }
  });
  