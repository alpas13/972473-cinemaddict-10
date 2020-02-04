import AbstractComponent from "./abstract-component.js";
import debounce from 'lodash/debounce';
import {DEBOUNCE_TIMEOUT, formatYear, formatTime} from "../utils/common.js";

export default class FilmCard extends AbstractComponent {
  constructor(card) {
    super();

    const {poster, title, totalRating, releaseDate, runtime, genre, description, comments, isAddToWatchList, isWatched, isFavorite} = card;
    this._poster = poster;
    this._title = title;
    this._rating = totalRating;
    this._year = releaseDate;
    this._runtime = runtime;
    this._genre = genre;
    this._description = description.length > 140 ? description.slice(0, 139).concat(`...`) : description;
    this._comments = comments.length;
    this._isAddToWatchList = isAddToWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return (`<article class="film-card">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${formatYear(this._year)}</span>
            <span class="film-card__duration">${formatTime(this._runtime)}</span>
            <span class="film-card__genre">${this._genre.slice().join(` `)}</span>
          </p>
          <img src="${this._poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <a class="film-card__comments">${this._comments} comments</a>
          <form class="film-card__controls">
            <button type="button" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isAddToWatchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button type="button" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button type="button" class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
          </form>
        </article>`
    );
  }

  setClickHandler(selector, handler) {
    this.getElement().querySelector(selector).addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }

  setAddToFavoriteHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, debounce(handler, DEBOUNCE_TIMEOUT));
  }
}


