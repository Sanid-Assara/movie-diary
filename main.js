//------- Serge part -------
//https://developer.themoviedb.org/reference/search-keyword
let searchInput = "";

function GetSearchResults(keyword) {
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${keyword}`;
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

function ProcessSearch(event) {
  searchInput = event.target.value;
}

function SubmitSearch(event) {
  event.preventDefault();
  console.log(searchInputEl.value);
  GetSearchResults(searchInputEl.value);
}

function ProcessSearchResults(data) {
  //   console.log(data);
  console.log(data.results.length);

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
  //   const searchCardMarkup = `
  //     <div class="flex flex-col items-center rounded-lg bg-[#21242D] text-white">
  //           <img src="${imageURL}" alt="${movie.title}" class="rounded-t-lg w-full" />
  //           <div class="py-4 px-2">
  //             <p class="font-bold text-xl">${movie.title}</p>
  //             <!-- Time and year -->
  //             <div class="flex justify-between mb-4">
  //               <span class="text-md">2h 32m</span>
  //               <span class="text-md">${movie.release_date}</span>
  //             </div>
  //             <!-- Heart, stars and genre -->
  //             <div class="flex justify-between items-center">
  //               <span class="bg-[#00B9AE] rounded-full font-bold p-2 mr-1">
  //                 <img src="img/heart-icon.svg" alt="" width="16px" />
  //               </span>
  //               <span class="flex font-semibold text-sm text-center"><img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2" /> 6.8</span>
  //               <span class="font-semibold text-sm text-right">Science Fiction</span>
  //             </div>
  //           </div>
  //         </div>`;

  const searchCardMarkup = `<div class="flex items-stretch bg-[#21242D] text-white">
          <img class="h-[200px]" src="${imageURL}" alt="${movie.title}" />
          <div class="px-4 w-full flex flex-col max-h-[180px] m-1">
            <p class="font-bold text-xl sm:max-w-fit">${movie.title}</p>
            <!-- Heart, stars and genre -->
            <div class="flex justify-start gap-6 items-center">
              <p class="text-md">${movie.release_date}</p>

              <span class="flex font-semibold text-sm text-center"><img src="img/star-icon.svg" alt="star" width="16px" class="flex mr-2" /> ${movie.vote_average.toFixed(1)}</span>
              <span class="font-semibold text-sm text-right">Science Fiction</span>
            </div>
            <p id="movie-description" class="text-ellipsis overflow-hidden text-sm mt-2">
              ${movie.overview}
            </p>
          </div>`;

  console.log(movie);

  cardsContainerEl.innerHTML += searchCardMarkup;
}

//------- Erika part -------
