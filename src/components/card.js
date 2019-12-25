import AbstractComponent from "./abstract-component.js";

export default class FilmCard extends AbstractComponent {
  constructor(card) {
    super();

    const {poster, title: {name, rating}, year, duration, genre, description, comments, isAddToWatchList, isWatched, isFavorite} = card;
    this._poster = poster;
    this._name = name;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genre = genre;
    this._description = description;
    this._comments = comments;
    this._isAddToWatchList = isAddToWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return (`<article class="film-card">
          <h3 class="film-card__title">${this._name}</h3>
          <p class="film-card__rating">${this._rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${this._year}</span>
            <span class="film-card__duration">${this._duration}</span>
            <span class="film-card__genre">${this._genre}</span>
          </p>
          <img src="${this._poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <a class="film-card__comments">${this._comments} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isAddToWatchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
          </form>
        </article>`
    );
  }

  setClickHandler(selector, handler) {
    this.getElement().querySelector(selector).addEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setAddToFavorite(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}


