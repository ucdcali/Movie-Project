import fetch from 'node-fetch';
import Movie from '../models/Movie.js';
let movie, watchedMovies, sortCriteria = {};

export const home = async (req, res) => {
  if (!watchedMovies) watchedMovies = await Movie.find();
  else watchedMovies = await Movie.find().sort(sortCriteria);
  res.render('index', { title: 'Home', movie, watchedMovies });
};

export const lookup = async (req, res) => {
  console.log(req.body);
  const key = process.env.MOVIE_KEY;
  const movieTitle = req.body.movieTitle || req.query.title;
  const url = `http://www.omdbapi.com/?t=${movieTitle}&apikey=${key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    movie = await response.json();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching data');
  }
};

export const watch = async (req, res) => {
  const { title, poster, director, year, boxOffice } = req.body;

  try {
    // Check if the movie already exists in the database
    let movie = await Movie.findOne({ title: title });

    if (movie) {
      // If movie exists, increment the timesWatched
      movie.timesWatched += 1;
      await movie.save();
    } else {
      // If movie doesn't exist, create a new one
      movie = new Movie({
        title,
        poster,
        director,
        year,
        boxOffice,
        timesWatched: 1
      });
      await movie.save();
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};

export const watchAgain = async (req, res) => {
  const movieId = req.body.movieId;

  try {
    const movie = await Movie.findById(movieId);
    if (movie) {
      movie.timesWatched += 1;
      await movie.save();
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};

export const deleteMovie = async (req, res) => {
  const movieId = req.body.movieId;

  try {
    const result = await Movie.findByIdAndDelete(movieId);
    req.flash('info', `${result.title} deleted`);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};

export const sortMovies = async (req, res) => {
  switch (req.query.by) {
    case 'name':
      sortCriteria = { title: 1 }; // 1 for ascending order
      break;
    case 'watched':
      sortCriteria = { timesWatched: -1 }; // -1 for descending order
      break;
    default:
      // Default sorting criteria or error handling
      break;
  }

  try {
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  }
};

export const displayMovie = async (req, res) => {
  const movieTitle = req.query.title;
  console.log(movieTitle);
  // Perform lookup using movieId
  // For example, using a Mongoose model:
  movie = await Movie.find({title: movieTitle});
  // Render the page with the movie details
  res.redirect('/');
};