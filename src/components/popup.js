import AbstractSmartComponent from "./abstract-smart-component";
import {remove} from "../utils/render.js";
import {formatDate, formatTime, formatCommentDate} from "../utils/common.js";

export default class Popup extends AbstractSmartComponent {
  constructor(detailData, commentsData) {
    super();

    this._EMOJI_PATH = `./images/emoji/`;
    this._ATTRIBUTE_FOR_PREFIX = `emoji-`;

    const {
      poster,
      ageRating,
      title,
      alternativeTitle,
      totalRating,
      director,
      writers,
      actors,
      releaseDate,
      runtime,
      releaseCountry,
      genre,
      description,
      personalRating,
      isAddToWatchList,
      isWatched,
      isFavorite
    } = detailData;

    this._poster = poster;
    this._ageRating = ageRating;
    this._title = title;
    this._originalTitle = alternativeTitle;
    this._totalRating = totalRating;
    this._director = director;
    this._writers = writers.join(`, `);
    this._actors = actors.join(`, `);
    this._releaseDate = releaseDate;
    this._runtime = runtime;
    this._country = releaseCountry;
    this._genre = genre;
    this._description = description;
    this._personalRating = personalRating;
    this._isAddToWatchList = isAddToWatchList;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
    this._newCommetnEmoji = ``;

    this._comments = commentsData;
    this._totalComments = this._comments.length;
    this._emotion = ``;
    this._comment = ``;

    this._setAddToWatchlistClickHandler = null;
    this._setAlreadyWatchedClickHandler = null;
    this._setAddToFavoriteHandler = null;
    this._setFilmUserRatingHandler = null;
    this._deleteCommentHandler = null;
    this._addCommentHandler = null;

    this._isControlKey = false;
    this._isMetaKey = false;

    this._subscribeOnEvents();
    this._selectPersonalRating();
  }

  getTemplate() {
    return (`<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${this._poster}" alt="">

          <p class="film-details__age">${this._ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${this._title}</h3>
              <p class="film-details__title-original">Original: ${this._originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${this._totalRating}</p>
              ${this._personalRating ? `<p class="film-details__user-rating">Your rate ${this._personalRating}</p>` : ``}
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${this._director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${this._writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${this._actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(this._releaseDate)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatTime(this._runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${this._country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${this._genre.length > 1 ? `Genres` : `Genre`}</td>
              <td class="film-details__cell">
                ${this._genre.map((value) => (
        `<span class="film-details__genre">${value}</span>`
      )).join(`\n`)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${this._description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isAddToWatchList ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    
    ${this._isWatched ? `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
              <label class="film-details__user-rating-label" for="rating-1">1</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
              <label class="film-details__user-rating-label" for="rating-2">2</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
              <label class="film-details__user-rating-label" for="rating-3">3</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
              <label class="film-details__user-rating-label" for="rating-4">4</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
              <label class="film-details__user-rating-label" for="rating-5">5</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
              <label class="film-details__user-rating-label" for="rating-6">6</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
              <label class="film-details__user-rating-label" for="rating-7">7</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
              <label class="film-details__user-rating-label" for="rating-8">8</label>

              <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9">
              <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>
    </div>` : ``}

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._totalComments}</span></h3>

        <ul class="film-details__comments-list">
          ${this._comments.slice().sort((a, b) => b.date - a.date).map((value) => {
        const {id, author, comment, date, emotion} = value;
        return (`<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${this._EMOJI_PATH}${emotion}.png" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatCommentDate(date)}</span>
                <button id="${id}" class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`);
      }).join(`\n`)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${this._newCommetnEmoji}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="grinning">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setAddToWatchlistClickHandler(this._setAddToWatchlistClickHandler);
    this.setAlreadyWatchedClickHandler(this._setAlreadyWatchedClickHandler);
    this.setAddToFavoriteHandler(this._setAddToFavoriteHandler);
    this.setFilmUserRatingHandler(this._setFilmUserRatingHandler);
    this.deleteCommentHandler(this._deleteCommentHandler);
    this.addCommentHandler(this._addCommentHandler);
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => remove(this));
    document.addEventListener(`keydown`, (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        remove(this);
      }
    });

    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, (evt) => {
      this._emotionChangeClickHandler(evt);
    });

    document.addEventListener(`keydown`, (evt) => {
      if (evt.key === `Meta` || evt.key === `Windows` || evt.key === `Command`) {
        this._isMetaKey = true;
        return;
      }
      if (evt.key === `Control` || evt.key === `Ctrl`) {
        this._isControlKey = true;
        const commentText = this.getElement().querySelector(`.film-details__comment-input`).value;
        if (this._isControlKey && this._comment !== commentText) {
          this._comment = commentText;
        }
      }
    });

    document.addEventListener(`keyup`, (evt) => {
      if (evt.key === `Control` || evt.key === `Ctrl`) {
        this._isControlKey = false;
      } else if (evt.key === `Meta` || evt.key === `Windows` || evt.key === `Command`) {
        this._isMetaKey = false;
      }
    });
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, () => {
      handler();
    });
    this._setAddToWatchlistClickHandler = handler;
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`click`, () => {
      handler();
    });
    this._setAlreadyWatchedClickHandler = handler;
  }

  setAddToFavoriteHandler(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, () => {
      handler();
    });
    this._setAddToFavoriteHandler = handler;
  }

  setFilmUserRatingHandler(handler) {
    const element = this.getElement().querySelector(`.film-details__user-rating-score`);
    const ratingElements = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    if (element) {
      element.addEventListener(`change`, (evt) => {
        if (evt.target.tagName === `INPUT`) {
          handler(evt.target.value);
          ratingElements.forEach((it) => {
            it.disabled = `disabled`;
          });
        }
      });
    }
    this._setFilmUserRatingHandler = handler;
  }

  deleteFilmUserRatingHandler(handler) {
    const element = this.getElement().querySelector(`.film-details__watched-reset`);
    if (element) {
      element.addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `BUTTON`) {
          handler();
        }
      });
    }
    this._setFilmUserRatingHandler = handler;
  }

  deleteCommentHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName === `BUTTON`) {
        handler(evt.target.id);
      }
    });
    this._deleteCommentHandler = handler;
  }

  addCommentHandler(handler) {
    document.addEventListener(`keydown`, (evt) => {
      const isEnterKey = evt.key === `Enter`;
      if (this._isControlKey && this._isMetaKey && isEnterKey && this._emotion && this._comment) {
        const commentElement = this.getElement().querySelector(`.film-details__comment-input`);
        const emojiElements = this.getElement().querySelectorAll(`.film-details__emoji-item`);
        const commentData = {
          comment: this._comment,
          date: new Date().toISOString(),
          emotion: this._emotion
        };
        commentElement.disabled = `disabled`;
        emojiElements.forEach((emoji) => {
          emoji.disabled = `disabled`;
        });
        handler(commentData);
        this._comment = ``;
        this._emotion = ``;
      }
    });
    this._addCommentHandler = handler;
  }

  _selectPersonalRating() {
    if (!this._personalRating || this._personalRating === 9) {
      return;
    }
    const oldPersonalRating = this.getElement().querySelector(`#rating-9`);
    const newPersonalRating = this.getElement().querySelector(`#rating-${this._personalRating}`);
    if (oldPersonalRating && newPersonalRating) {
      oldPersonalRating.setAttribute(`checked`, ``);
      newPersonalRating.setAttribute(`checked`, `checked`);
    }
  }

  _emotionChangeClickHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      this._emotion = evt.target.id.substring(this._ATTRIBUTE_FOR_PREFIX.length);
      this._newCommetnEmoji = `<img src="./images/emoji/${this._emotion}.png" width="55" height="55" alt="emoji">`;
    }
    this.rerender();
  }
}
