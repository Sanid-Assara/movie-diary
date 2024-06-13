// Retrieve the array of favorite movies from local storage
const localStorageData = JSON.parse(localStorage.getItem("search-favorites"));

const favoriteMoviesContainer = document.querySelector(
  "#favorite-movies-container"
);

// Function to convert genre id to genre name
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
function getGenreById(genres, id) {
  const genre = genres.find((genre) => genre.id === id);
  return genre ? genre.name : "Not Specified";
}

//No cards Markup
const noCardsParagraph = `<p class="text-gray-700 text-lg font-[lato] px-14 py-40 mx-auto text-center">
  You don't have any favorite movies yet. Start adding some to see them here!
</p>`;

// Function to generate a card
function generateCard(i) {
  const favoriteMoviesCardMarkup = `<div class="movie-card flex flex-col rounded-[18px] bg-[#21242D] text-white">
            <img
              src="https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${
                localStorageData[i].poster_path
              }
              "
              alt="movie name"
              class="rounded-t-[18px] w-full"
            />

            <div class="py-4 px-2">
              <p class="font-bold text-xl line-clamp-1 mb-2">
              ${localStorageData[i].title}
              </p>
              <!-- Year + Rating -->
              <div class="flex items-center justify-between mb-4">
                <span class="text-md">${
                  localStorageData[i].release_date.length > 0
                    ? localStorageData[i].release_date.slice(0, -6)
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
                  ${localStorageData[i].vote_average.toFixed(1)}
                </span>
              </div>
              <!-- Add to List Button + Genre -->
              <div class="flex justify-between items-center">
                <button
                  id=${i}
                  class="heart-button-filled bg-[#00B9AE] rounded-full font-bold p-2 mr-1 hover:animate-bounce"
                >
                  <img src="img/heart-icon-selected.svg" alt="" width="18px" />
                </button>

                <span class="font-semibold text-sm text-right">${getGenreById(
                  genres,
                  localStorageData[i].genre_ids[0]
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
}

// Loop over the localStorage array
if (localStorageData.length === 0) {
  favoriteMoviesContainer.insertAdjacentHTML("beforeend", noCardsParagraph);
  favoriteMoviesContainer.className = "";
  favoriteMoviesContainer.classList.add(
    "flex",
    "items-center",
    "justify-center"
  );
} else {
  for (let i = 0; i < localStorageData.length; i++) {
    generateCard(i);
  }
}

// Function to handle heart button click
function handleHeartButtonClick(event) {
  const button = event.currentTarget;
  const movieCard = button.closest(".movie-card");
  const index = parseInt(movieCard.getAttribute("data-index"), 10);

  // Remove the movie from local storage data
  localStorageData.splice(index, 1);

  // Update local storage
  localStorage.setItem("search-favorites", JSON.stringify(localStorageData));

  // Remove the movie card from the DOM
  favoriteMoviesContainer.removeChild(movieCard);

  // Update the indices of the remaining movie cards
  document.querySelectorAll(".movie-card").forEach((card, i) => {
    card.setAttribute("data-index", i);
  });
  // Reload the page if the localStorage is empty
  if (localStorageData.length === 0) {
    window.location.reload();
  }
}

// Attach event listeners to heart buttons
const heartButtons = document.querySelectorAll(".heart-button-filled");
heartButtons.forEach((button) => {
  button.addEventListener("click", handleHeartButtonClick);
});
