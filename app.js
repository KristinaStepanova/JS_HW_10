function myHttp() {
  return {
    request(url, options) {
      return Promise.resolve().then(() => {
        return fetch(url, options).then(response => {
          if (!response.ok) {
            return Promise.reject(`Error. Status code: ${response.status}`);
          }
          return response.json();
        });
      });
    }
  };
}
// Init http module
const http = myHttp();
const newsService = (function() {
  const apiKey = "707779af7eb74d66955a486612084779";
  const apiUrl = "https://newsapi.org/v2";

  return {
    topHeadlines(country = "ua", category = "sport") {
      return Promise.resolve().then(() => {
        return http.request(
          `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
        );
      });
    },
    everything(text) {
      return Promise.resolve().then(() => {
        return http.request(`${apiUrl}/everything?q=${text}&apiKey=${apiKey}`);
      });
    }
  };
})();

// Elements
const newsContainer = document.querySelector(".news-container .row");
const form = document.forms["newsControls"];
const formCountry = form.elements["country"];
const formSearch = form.elements["search"];
const formCat = form.elements["categories"];

document.addEventListener("DOMContentLoaded", function() {
  M.AutoInit();
  loadNews();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  loadNews();
});

function loadNews() {
  const countryValue = formCountry.value;
  const searchValue = formSearch.value;
  const catValue = formCat.value;

  if (searchValue) {
    newsService.everything(searchValue)
    .then(data => onGetResponse(data))
    .catch(err => alert(err));
  } else {
    newsService.topHeadlines(countryValue, catValue)
    .then(data => onGetResponse(data))
    .catch(err => alert(err));
  }
  form.reset();
}

function onGetResponse(res) {
  
  if (!res.articles.length) {
    alert("Новостей не найдено");
    return;
  }

  renderNews(res.articles);
}

function renderNews(newsItems) {
  newsContainer.innerHTML = "";
  let fragment = "";

  newsItems.forEach(item => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}

function newsTemplate({ url, title, description, urlToImage } = {}) {
  return `
      <div class="col s12">
        <div class="card">
          <div class="card-image">
            <img src="${urlToImage}">
            <span class="card-title">${title || ""}</span>
          </div>
          <div class="card-content">
            <p>${description || ""}</p>
          </div>
          <div class="card-action">
            <a href="${url}">Read more</a>
          </div>
        </div>
      </div>
    `;
}
