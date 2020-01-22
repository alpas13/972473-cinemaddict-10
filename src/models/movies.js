import {FilterType, getMoviesByFilter} from "../utils/filter.js";

export default class Movies {
  constructor() {
    this._movies = [];

    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._activeFilterType);
  }

  getAllMovies() {
    return this._movies;
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  upDateMovie(id, newMovie) {
    const index = this.getMovies().findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    const cards = [].concat(this.getMovies().slice(0, index), newMovie, this.getMovies().slice(index + 1));
    this.setMovies(cards);
    this.setDataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setDataChangeHandlers(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}
