//------- Serge part -------
let searchInput = "";
let movieGenres = [];
const searchURL = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&`;
const genreURL = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
const detailsURL = `https://www.themoviedb.org/movie/`;
("page=1&query=");

const searchInputEl = document.getElementById("search");
const searchFormEl = document.getElementById("search-form");
const cardsContainerEl = document.getElementById("search-results");
const popularMoviesEl = document.getElementById("cards-container");
const dialogEl = document.getElementById("search-dialog");

searchInputEl.addEventListener("input", ProcessSearch);
searchFormEl.addEventListener("submit", SubmitSearch);

document.onclick = (e) => {
  if (!FindParentElement(dialogEl, e.target) && dialogEl.open) dialogEl.close();
};

GetGenres();

// ----Adding and Removing from Favorites using LocalStorage
let favorites = [];
const favKey = "search-favorites";
window.addEventListener("load", () => (favorites = JSON.parse(localStorage.getItem(favKey)) || []));

function AddToFavoritesStorage(movie) {
  if (favorites.includes(movie)) return;

  favorites.push(movie);
  localStorage.setItem(favKey, JSON.stringify(favorites));
}

function RemoveFromFavoritesStorage(movie) {
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].id == movie.id) {
      favorites.splice(i, 1);
      localStorage.setItem(favKey, JSON.stringify(favorites));
    }
  }
}

function IsFavorite(movie) {
  if (favorites.find((x) => x.id === movie.id)) return true;
  return false;
}
//--------------------------------------------------
function GetSearchResults(keyword, page) {
  const url = `${searchURL}query=${keyword}&page=${page}`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  })
    .then((res) => ProcessResponse(res))
    .then((json) => ProcessSearchResults(json))
    .catch((error) => console.error(error.message));
}

function GetGenres() {
  fetch(genreURL, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  })
    .then((res) => ProcessResponse(res))
    .then((json) => (movieGenres = json.genres))
    .catch((error) => console.error(error.message));
}

function ProcessResponse(res) {
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

//Find a parent element from child element
function FindParentElement(elementToFind, startingElement) {
  let currentElement = startingElement;
  if (currentElement == elementToFind) return true;
  while (currentElement.parentElement) {
    currentElement = currentElement.parentElement;
    if (currentElement == elementToFind) return true;
  }
  return false;
}

function ProcessSearch(event) {
  const highlighted = ["bg-[#3ae4de50]", "hover:cursor-pointer", "hover:bg-[#238a83]"];
  const searchImg = document.getElementById("search-img-wrapper");
  searchInput = event.target.value;
  if (searchInput.length > 0) {
    searchImg.classList.add(...highlighted);
    searchImg.classList.remove("opacity-50");
    searchImg.onclick = () => GetSearchResults(searchInputEl.value, 1);
  } else {
    searchImg.classList.remove(...highlighted);
    searchImg.classList.add("opacity-50");
    searchImg.onclick = () => null;
  }
}

function SubmitSearch(event) {
  event.preventDefault();
  GetSearchResults(searchInputEl.value, 1);
}

function ProcessSearchResults(data) {
  const resultsPage = data.results;
  clearChildren(cardsContainerEl);

  dialogEl.show();
  const searchKeyEl = document.getElementById("search-keyword");
  const searchFoundEl = document.getElementById("search-found");
  const searchCurPageEl = document.getElementById("search-current-page");
  const searchTotalPageEl = document.getElementById("search-total-pages");
  const prevBtn = document.getElementById("search-prev");
  const nextBtn = document.getElementById("search-next");

  if (data.total_results > 0) {
    searchKeyEl.innerText = `Search results for: "${searchInput}"`;
    searchFoundEl.innerText = "Total results: " + data.total_results;

    if (data.total_pages > 1) {
      searchCurPageEl.innerText = "Page: " + data.page;
      searchTotalPageEl.innerText = "/ " + data.total_pages;
    } else {
      searchCurPageEl.innerText = "";
      searchTotalPageEl.innerText = "";
    }

    if (data.total_pages > 1 && data.page < data.total_pages) {
      nextBtn.classList.remove("hidden");
      nextBtn.onclick = () => GetSearchResults(searchInputEl.value, data.page + 1);
    } else nextBtn.classList.add("hidden");

    if (data.page === 1) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
      prevBtn.onclick = () => GetSearchResults(searchInputEl.value, data.page - 1);
    }

    for (let i = 0; i < resultsPage.length; i++) {
      ShowSearchResultCardUI(resultsPage[i]);
    }
  } else {
    searchKeyEl.innerText = `Search results for: "${searchInput}"`;
    searchFoundEl.innerText = "Nothing found";
    searchCurPageEl.innerText = "";
    searchTotalPageEl.innerText = "";
    nextBtn.classList.add("hidden");
    prevBtn.classList.add("hidden");
  }
}

function clearChildren(element) {
  while (element.lastElementChild) element.removeChild(element.lastElementChild);
}

function ShowSearchResultCardUI(movie) {
  const imageURL = `https://image.tmdb.org/t/p/w300/${movie.poster_path}`;
  let genre = "";
  for (let genreId of movie.genre_ids) genre += movieGenres.find((x) => x.id === genreId).name + ", ";
  if (genre.length > 0) genre = genre.slice(0, -2); //remove last ", "

  const searchCardMarkup = `
  <div class="flex items-stretch bg-[#21242D] text-white relative">
    <img id="search-image" class="h-[180px] w-[120px] object-cover hover:cursor-pointer"
     src="${imageURL}" 
     alt="${movie.title}" />
    <div class="px-4 w-full flex flex-col max-h-[160px] m-1 justify-evenly">
      <p id="search-movie-title" class="font-bold text-l sm:max-w-fit text-[#00b9ae] hover:cursor-pointer">
       ${movie.title}</p>
      <div class="flex justify-start gap-6 items-center">
        <p class="text-md">
         ${movie.release_date.length > 0 ? movie.release_date.slice(0, -6) : ""}</p>
        <span class="flex font-semibold text-sm text-center">
        <img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2"/>
         ${movie.vote_average.toFixed(1)}</span>
        <span class="font-semibold text-sm text-right italic text-[#00b9ae]">
         ${genre}</span>
      </div>
      <p id="movie-description" class="text-ellipsis overflow-hidden text-sm mt-2">
       ${movie.overview}
      </p>
      <div id="search-fav" class="hover:cursor-pointer">
        <div class="bg-[#16181e] opacity-40 self-start p-2 absolute rounded-md right-1 top-1 h-[33px] w-[36px]"></div>
        <img class="self-start p-2 absolute rounded-md right-1 top-1" src="img/heart-icon.svg" alt="" />
      </div>
  </div>`;

  const movieEl = document.createElement("div");
  movieEl.innerHTML = searchCardMarkup;
  movieEl.querySelector("#search-movie-title").onclick = () => openDetails();
  const img = movieEl.querySelector("img");
  img.onclick = () => openDetails();
  img.onerror = () => (img.src = "./img/search-no-image.png");
  cardsContainerEl.appendChild(movieEl);

  //add to favorites
  const favBtn = movieEl.querySelector("#search-fav");

  if (IsFavorite(movie)) addToFavoritesUI();
  else removeFromFavoritesUI();

  favBtn.onclick = () => {
    if (favBtn.children[1].id == "fav") {
      removeFromFavoritesUI();
      RemoveFromFavoritesStorage(movie);
    } else {
      addToFavoritesUI();
      AddToFavoritesStorage(movie);
    }
  };

  function removeFromFavoritesUI() {
    favBtn.children[1].src = "./img/heart-icon.svg";
    favBtn.children[1].id = "";
  }

  function addToFavoritesUI() {
    favBtn.children[1].src = "./img/heart-icon-selected.svg";
    favBtn.children[1].id = "fav";
  }

  function openDetails() {
    window.open(detailsURL + movie.id, "_blank");
  }
}

//------- Erika part -------

const popUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;

async function fetchItems(popUrl) {
  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  };

  try {
    const response = await fetch(`${popUrl}`, options);
    const movies = await response.json();
    // console.log(movies);

    return movies;
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", async () => {
  const movies = await fetchItems(popUrl);
  const popularMovies = movies.results;
  // console.log(popularMovies);
  popularMovies.forEach((movie) => {
    cardUI(movie);
  });
});

function cardUI(movie) {
  const imageURL = `https://image.tmdb.org/t/p//w300_and_h450_bestv2/`;
  const detailsURL = `https://www.themoviedb.org/movie/`;

  // console.log(movie);

  let genre = "";
  for (let genreId of movie.genre_ids) genre += movieGenres.find((x) => x.id === genreId).name + ", ";
  // console.log(genre);
  if (genre.length > 0) genre = genre.slice(0, -2); //remove last ", "

  const card = `
      <a href="${detailsURL}${movie.id}" target="_blank">
        <img class="rounded-t-[18px] w-full"
        src="${imageURL}${movie.poster_path}"
        alt="${movie.title}"
        />
      </a>
      <div class="py-4 px-2">
        <p id="movie-title" class="font-bold text-xl line-clamp-1 mb-2">${movie.title}</p>
        <div class="flex justify-between mb-4">
          <span class="text-md">
            ${movie.release_date.length > 0 ? movie.release_date.slice(0, -6) : ""}
          </span>
          <span class="flex font-semibold text-sm text-center">
            <img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2"/>
            ${movie.vote_average.toFixed(1)}
          </span>
        </div>
        <div class="flex justify-between items-center">
        <button id="add-toList" class="bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:cursor-pointer">
          <img src="img/heart-icon.svg" alt="" width="18px" />
        </button>
        <span class="font-semibold text-sm text-right text-[#00b9ae]">
        ${genre}
        </span>
      </div>
      </div>
  `;

  // popularMoviesEl.insertAdjacentHTML("beforeend", card);

  // Add Movie to faorites
  const cardDiv = document.createElement("div");

  cardDiv.classList.add("flex", "flex-col", "rounded-[18px]", "bg-[#21242D]", "text-white");

  cardDiv.innerHTML = card;
  popularMoviesEl.appendChild(cardDiv); // to insert inside carDiv the variable card from the top

  const toList = cardDiv.querySelector("#add-toList");
  // console.log(toList);

  // Test with .onclick (yes it works too!)
  toList.onclick = () => {
    // const favKey = "popular-favorites"; // the value for kew to show in local storage can be added as a "String" or save in a variable and use his name favKey
    toList.classList.toggle("bg-amber-400"); // Add newone class
    const movies = JSON.parse(localStorage.getItem(favKey)) || [];

    movies.push(movie);
    localStorage.setItem(favKey, JSON.stringify(movies));
  };

  // Test with .addEventListener (yes it works!)
  // toList.addEventListener("click", () => {
  //   toList.classList.toggle("bg-amber-400"); // Add newone class
  //   const movies = JSON.parse(localStorage.getItem(favKey)) || [];

  //   movies.push(movie);
  //   localStorage.setItem(favKey, JSON.stringify(movies));
  // });
  //
} // end of function cardUI
