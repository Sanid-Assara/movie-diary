const apiKey = "3cfaa214effa89b822afbd22f5852286";
const baseUrl = "https://api.themoviedb.org/3";
let pageNumber = 1;
const endpoint = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

// Retrieve the array from local storage
const localStorageData = JSON.parse(localStorage.getItem("favoriteMovies"));
let pageLocal = localStorageData[0].page;
let numberLocal = localStorageData[2].number;

// Function to convert genre id to genre name
function getGenreById(genres, id) {
  const genre = genres.find((genre) => genre.id === id);
  return genre ? genre.name : "Not Specified";
}

const favoriteMoviesContainer = document.querySelector(
  "#favorite-movies-container"
);
// Function to fetch a favorite movie card
function fetchFavoriteMovieCard(i) {
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const favoriteMoviesCardMarkup = `<div class="flex flex-col rounded-[18px] bg-[#21242D] text-white">
            <img
              src="https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${
                data.results[i].poster_path
              }
              "
              alt="movie name"
              class="rounded-t-[18px] w-full"
            />

            <div class="py-4 px-2">
              <p class="font-bold text-xl line-clamp-1 mb-2">
              ${data.results[i].title}
              </p>
              <!-- Year + Rating -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-md">${
                  data.results[i].release_date.length > 0
                    ? data.results[i].release_date.slice(0, -6)
                    : ""
                }</span>
                <span
                  class="flex items-center font-semibold text-sm text-center"
                >
                  <img
                    src="img/star-icon.svg"
                    alt="star"
                    width="16px"
                    class="flex mr-2"
                  />
                  ${data.results[i].vote_average.toFixed(1)}
                </span>
              </div>
              <!-- Add to List Button + Genre -->
              <div class="flex justify-between items-center">
                <button
                  id="add-toList"
                  class="bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:animate-bounce"
                >
                  <img src="img/heart-icon-selected.svg" alt="" width="18px" />
                </button>

                <span class="font-semibold text-sm text-right">${getGenreById(
                  genres,
                  data.results[i].genre_ids[0]
                )}</span>
              </div>
            </div>
            <!-- Add A Note Button -->
            <div class="flex items-center justify-center w-full px-4 mb-4">
              <button
                class="flex items-center text-wrap justify-center gap-4 rounded-2xl w-full bg-gray-100 bg-opacity-20 backdrop-blur-l px-10 py-2"
              >
                <img src="img/add-icon.svg" alt="Add icon" />
                <p class="text-base font-bold font-[lato] text-[#F9F9F9]">
                  Add a note
                </p>
              </button>
            </div>
          </div>`;

      favoriteMoviesContainer.insertAdjacentHTML(
        "beforeend",
        favoriteMoviesCardMarkup
      );
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}

// for (let i = 0; i < 20; i++) {
//   fetchFavoriteMovieCard(i);
// }

fetchFavoriteMovieCard(numberLocal);

//local Storage

const favoriteMovies = [
  { page: 1, number: 1 },
  { page: 1, number: 2 },
  { page: 1, number: 4 },
  { page: 2, number: 10 },
];

function saveToLocalStorage(key, array) {
  // Convert the array to a JSON string
  const jsonString = JSON.stringify(array);
  // Store the JSON string in local storage with the provided key
  localStorage.setItem(key, jsonString);
}

saveToLocalStorage("favoriteMovies", favoriteMovies);
