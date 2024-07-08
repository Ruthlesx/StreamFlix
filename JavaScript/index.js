'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

sidebar();

// Home page Sections
const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming"
  },
  {
    title: "Newly Suggested",
    path: "/movie/top_rated"
  }
];

const pageContent = document.querySelector(".heroSection");

if (pageContent) {  // Check if pageContent is not null
  const heroBanner = function ({ results: movieList }) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.setAttribute("aria-label", "Popular Movies");

    const heroImagesContainer = document.createElement('div');
    heroImagesContainer.classList.add('heroImagesContainer');

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('controlsContainer');

    // Assuming the hero image should be displayed for the first movie only
    if (movieList.length > 0) {
      const {
        backdrop_path,
        title
      } = movieList[0];  // Use the first movie only

      // Update banner's innerHTML with movie details for the first movie
      banner.innerHTML = `
        <div class="heroText">
          <h1>STREAMFIX</h1>
          <p>Unlimited Entertainment: <span>Movies, TV Shows & More</span></p>
          <a href="./detail.html"><button><img src="./assets/play icon.png" alt="">PLAY NOW</button></a> 
        </div>
        <div class="heroImages">
          <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}">
        </div>
      `;

      pageContent.appendChild(banner);
    }

    // Function to update the hero image
    const updateHeroImage = (movie) => {
      const { backdrop_path, title } = movie;
      const heroImages = banner.querySelector('.heroImages');
      heroImages.innerHTML = `
        <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}">
      `;
    };

    // Add control items for each movie and add click event listener
    movieList.forEach((movie, index) => {
      const { poster_path, title } = movie;
      const controlItem = document.createElement('button');
      controlItem.classList.add('poster-box');
      controlItem.setAttribute("data-index", index);
      controlItem.innerHTML = `
        <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
      `;
      controlItem.addEventListener('click', () => {
        updateHeroImage(movie);
      });
      controlsContainer.appendChild(controlItem);
    });

    banner.appendChild(heroImagesContainer);
    banner.appendChild(controlsContainer);

    // Add sliding functionality for controlsContainer
    controlsContainer.style.display = 'flex';
    controlsContainer.style.overflowX = 'auto';
    controlsContainer.style.scrollBehavior = 'smooth';
  };

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
} else {
  console.error('Element with class "heroSection" not found.');
}

// Create the movie list section
const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list-section");
  movieListElem.setAttribute("aria-label", `${title}`);

  movieListElem.innerHTML = `
    <h2 class="title">${title}</h2>
    <div class="movie-list-container">
      <button class="slide-left">&lt;</button>
      <div class="movie-list">
        <!-- Movies will be inserted here -->
      </div>
      <button class="slide-right">&gt;</button>
    </div>
  `;

  for (const movie of movieList) {
    const card = createMovieCard(movie);  
    movieListElem.querySelector(".movie-list").appendChild(card);
  }

  pageContent.appendChild(movieListElem);

  // Add sliding functionality with smooth easing
  const movieListDiv = movieListElem.querySelector('.movie-list');
  const slideLeftButton = movieListElem.querySelector('.slide-left');
  const slideRightButton = movieListElem.querySelector('.slide-right');

  slideLeftButton.addEventListener('click', () => {
    movieListDiv.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  });

  slideRightButton.addEventListener('click', () => {
    movieListDiv.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  });
};

// Fetch data for both sections
fetchDataFromServer(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=1`, (data) => {
  createMovieList(data, homePageSections[0].title);
});

fetchDataFromServer(`https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=1`, (data) => {
  createMovieList(data, homePageSections[1].title);
}); 