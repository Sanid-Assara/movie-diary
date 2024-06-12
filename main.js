//------- Serge part -------
let searchInput = "";
let movieGenres = [];
const searchURL = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=`;
const genreURL = `https://api.themoviedb.org/3/genre/movie/list?language=en`;

function GetSearchResults(keyword) {
  const url = `${searchURL}${keyword}`;
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
//-------
const searchInputEl = document.getElementById("search");
const searchFormEl = document.getElementById("search-form");
const cardsContainerEl = document.getElementById("search-results");
const popularMoviesEl = document.getElementById("cards-container");

searchInputEl.addEventListener("input", ProcessSearch);
searchFormEl.addEventListener("submit", SubmitSearch);

GetGenres();

function ProcessSearch(event) {
  searchInput = event.target.value;
}

function SubmitSearch(event) {
  event.preventDefault();
  GetSearchResults(searchInputEl.value);
}

function ProcessSearchResults(data) {
  console.log(data.results);
  const resultsPage = data.results;
  clearChildren(cardsContainerEl);
  clearChildren(popularMoviesEl);
  for (let i = 0; i < resultsPage.length; i++) {
    ShowSearchResultCardUI(resultsPage[i]);
  }
}

function clearChildren(element) {
  while (element.lastElementChild)
    element.removeChild(element.lastElementChild);
}

function ShowSearchResultCardUI(movie) {
  const imageURL = `https://image.tmdb.org/t/p/w94_and_h141_bestv2/${movie.poster_path}`;
  let genre = "";
  for (let genreId of movie.genre_ids)
    genre += movieGenres.find((x) => x.id === genreId).name + ", ";
  if (genre.length > 0) genre = genre.slice(0, -2); //remove last ", "

  const searchCardMarkup = `<div class="flex items-stretch bg-[#21242D] text-white">
          <img id="search-image" class="h-[200px]"
          src="${imageURL}" 
          alt="${movie.title}" />
          <div class="px-4 w-full flex flex-col max-h-[180px] m-1">
            <p class="font-bold text-xl sm:max-w-fit text-[#00b9ae]">
            ${movie.title}</p>
            <div class="flex justify-start gap-6 items-center">
              <p class="text-md">
              ${
                movie.release_date.length > 0
                  ? movie.release_date.slice(0, -6)
                  : ""
              }</p>
              <span class="flex font-semibold text-sm text-center">
              <img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2"/>
              ${movie.vote_average.toFixed(1)}</span>
              <span class="font-semibold text-sm text-right italic text-[#00b9ae]">
              ${genre}</span>
            </div>
            <p id="movie-description" class="text-ellipsis overflow-hidden text-sm mt-2">
              ${movie.overview}
            </p>
          </div>`;

  const movieEl = document.createElement("div");
  movieEl.innerHTML = searchCardMarkup;
  const img = movieEl.querySelector("img");
  img.onerror = () => (img.src = "./img/search-no-image.png");
  cardsContainerEl.appendChild(movieEl);
}

function checkImage(source, element) {
  const image = new Image();
  image.src = source;
  image.onerror = function () {
    element.querySelector("img").src = "./img/search-no-image.png";
  };
}

//------- Erika part -------

const popUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
function fetchPopuplar(i) {
  const imageURL = `https://image.tmdb.org/t/p//w300_and_h450_bestv2/`;

  const options = {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOWM5NDUxNTBhYmIyYTY1ZjhkYTliZTYxOGI4MmFmOSIsInN1YiI6IjY2NjZiNDIzOTE0Yjg4OTA3YWU5ZDNjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-3rLuyFChJ4INeqA33ircOiCiRms_QyOggdAkeJ74N4",
      Accept: "application/json",
    },
  };

  fetch(`${popUrl}`, options)
    .then((response) => {
      if (!response.ok) throw new Error("Fetching failed");
      return response.json();
    })
    .then((data) => {
      // console.log(data.results);

      // Card markup
      const card = `
  <div class="flex flex-col rounded-[18px] bg-[#21242D] text-white">
    <img
      src="${imageURL}${data.results[i].poster_path}"
      alt="movie name"
      class="rounded-t-[18px] w-full"/>

    <div class="py-4 px-2">
      <p class="font-bold text-xl line-clamp-1 mb-2">${
        data.results[i].title
      }</p>
      <div class="flex justify-between mb-4">
        <span class="text-md">
          ${
            data.results[i].release_date.length > 0
              ? data.results[i].release_date.slice(0, -6)
              : ""
          }
        </span>
        <span class="flex font-semibold text-sm text-center">
          <img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2"/>
          ${data.results[i].vote_average.toFixed(1)}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <button
          id="add-toList"
          class="bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:animate-bounce"
        >
          <img src="img/heart-icon.svg" alt="" width="18px" />
        </button>

        <span class="font-semibold text-sm text-right">
        Action
        </span>
      </div>
    </div>
  </div>

  `;
      // console.log(data.results[0]);
      // Display new Mark up
      popularMoviesEl.insertAdjacentHTML("beforeend", card);
    })
    .catch((err) => console.error(err));
}

for (let i = 0; i < 20; i++) {
  fetchPopuplar(i);
}
