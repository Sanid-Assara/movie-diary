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
  while (element.lastElementChild) element.removeChild(element.lastElementChild);
}

function ShowSearchResultCardUI(movie) {
  const imageURL = `https://image.tmdb.org/t/p/w94_and_h141_bestv2/${movie.poster_path}`;
  let genre = "";
  for (let genreId of movie.genre_ids) genre += movieGenres.find((x) => x.id === genreId).name + ", ";
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
          </div>`;

  const movieEl = document.createElement("div");
  movieEl.innerHTML = searchCardMarkup;
  const img = movieEl.querySelector("img");
  img.onerror = () => (img.src = "./img/search-no-image.png");
  cardsContainerEl.appendChild(movieEl);
}

//------- Erika part -------
