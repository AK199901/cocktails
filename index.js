import { fetchData } from './utilities.js';

const app = document.querySelector('#app');

document.querySelector('#home').addEventListener('click', function () {
  showHomePage();
});

document.querySelector('#search').addEventListener('click', function () {
  showSearchPage();
});

function showHomePage() {
  app.innerHTML = '<h1>Random Cocktail</h1>';
  fetchData('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(data => {
      const cocktail = data.drinks[0];
      app.innerHTML += `
        <div class="cocktail">
          <h2>${cocktail.strDrink}</h2>
          <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
          <button class="button" id="new-cocktail">Generate New</button>
          <button class="button" id="see-more">See More</button>
        </div>
      `;

      document.querySelector('#new-cocktail').addEventListener('click', function () {
        showHomePage();
      });

      document.querySelector('#see-more').addEventListener('click', function () {
        showDetailPage(cocktail.idDrink);
      });
    });
}

function showDetailPage(id) {
  fetchData(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(data => {
      const cocktail = data.drinks[0];
      app.innerHTML = `
        <h1>${cocktail.strDrink}</h1>
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <p>Category: ${cocktail.strCategory}</p>
        <p>Tags: ${cocktail.strTags || 'None'}</p>
        <p>Instructions: ${cocktail.strInstructions}</p>
        <p>Glass: ${cocktail.strGlass}</p>
        <h3>Ingredients</h3>
        <ul>
          ${Object.keys(cocktail)
            .filter(key => key.startsWith('strIngredient') && cocktail[key])
            .map(key => `<li>${cocktail[key]} - ${cocktail['strMeasure' + key.slice(13)] || ''}</li>`)
            .join('')}
        </ul>
        <button class="button" id="back">Back</button>
      `;

      document.querySelector('#back').addEventListener('click', function () {
        showHomePage();
      });
    });
}

function showSearchPage() {
  app.innerHTML = `
    <h1>Search Cocktails</h1>
    <form id="search-form">
      <input type="text" id="search-input" placeholder="Search by name" required>
      <button type="submit" class="button">Search</button>
    </form>
    <div id="search-results"></div>
  `;

  document.querySelector('#search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.querySelector('#search-input').value;
    fetchData(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
      .then(data => {
        const resultsDiv = document.querySelector('#search-results');
        if (data.drinks) {
          resultsDiv.innerHTML = data.drinks.map(drink => `
            <p>
              <a href="#" class="drink-link" data-id="${drink.idDrink}">${drink.strDrink}</a>
            </p>
          `).join('');

          document.querySelectorAll('.drink-link').forEach(link => {
            link.addEventListener('click', function (e) {
              e.preventDefault();
              showDetailPage(this.dataset.id);
            });
          });
        } else {
          resultsDiv.innerHTML = '<p>No results found.</p>';
        }
      });
  });
}

showHomePage();
