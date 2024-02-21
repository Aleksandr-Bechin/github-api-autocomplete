const clearResults = function() {
	const deleteButtons = document.querySelectorAll(".favorite-repo__delete-btn");
	const resultsContainer = document.querySelector('.results');
	deleteButtons.forEach((item) => item.removeEventListener("click", deleteRepo));
	resultsContainer.innerHTML = '';
};

const clearInput = function() {
	const searchInput = document.querySelector('.search-input');
	searchInput.value = '';
};

const showResults = function(results) {
	clearResults();

	const resultsContainer = document.querySelector('.results');

	if (results.length === 0) {
		resultsContainer.insertAdjacentHTML('afterbegin', `<p class="error-message">Nothing found</p>`);
	}
	const resultsForShowing = results.slice(0, 5);

	resultsForShowing.forEach((result) => {
		const resultCard = document.createElement('div');
		resultCard.classList.add('result');
		resultCard.insertAdjacentHTML('afterbegin', `<p class="result__title">${result.name}</p>`);
		resultsContainer.appendChild(resultCard);
		resultCard.addEventListener('click', () => saveRepo(result));
	});
};

const showError = function(errorMessage) {
	clearResults();
	const resultsContainer = document.querySelector('.results');
	resultsContainer.insertAdjacentHTML('afterbegin', `<p class="error-message">${errorMessage}</p>`);
};

const getData = async function(query) {
    let searchInputData = document.querySelector('.search-input').value;
	if (searchInputData.trim().length === 0) {
		return;
	} else {
		try {
			const response = await fetch(`https://api.github.com/search/repositories?q=${query}`, {
				method: 'GET',
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			});
			if (!response.ok) {
				throw new Error('An error occurred while receiving data');
			} else {
				const results = await response.json();
				showResults(results.items);
			}
		} catch (error) {
			console.log(error);
			showError(error.message);
		}
	}
};

const saveRepo = function(repo) {
	clearInput();
	const repoName = repo.name;
	const repoOwner = repo.owner.login;
	const repoStars = repo.stargazers_count;
	const savedContainer = document.querySelector('.saved');
	const savedRepoCard = document.createElement('div');
	savedRepoCard.classList.add('favorite-repo');
	savedRepoCard.insertAdjacentHTML(
		'afterbegin',
		`<div class="favorite-repo__inner">
      <div class="favorite-repo__info">
          <p class="favorite-repo__data">Name: ${repoName}</p>
          <p class="favorite-repo__data">Owner: ${repoOwner}</p>
          <p class="favorite-repo__data">Stars: ${repoStars}</p>
      </div>
      <button class="favorite-repo__delete-btn">X</button>
  </div>`
	);
	clearResults();
	savedContainer.appendChild(savedRepoCard);
	const deleteBtn = savedRepoCard.querySelector('.favorite-repo__delete-btn');
	deleteBtn.addEventListener('click', deleteRepo);
};

const deleteRepo = function(event) {
	event.target.removeEventListener('click', deleteRepo);
	event.target.parentNode.parentNode.remove();
};

const debounce = (fn, debounceTime) => {
	let debounceTimer;
	return function() {
		const args = arguments;
		const context = this;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => fn.apply(context, args), debounceTime);
	};
};

const debouncegetData = debounce(getData, 700);

const getDataFromInput = async function() {
	let searchInputData = document.querySelector('.search-input').value;

	if (searchInputData.trim().length === 0) {
        clearResults();
		return;
	} else {
		debouncegetData(searchInputData);
	}
};

document.querySelector('.search-input').addEventListener('input', getDataFromInput);