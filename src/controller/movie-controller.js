import FilmCardComponent from "../components/card";
import PopupComponent from "../components/popup";
import {render, replace, RenderPosition, remove} from "../utils/render";
import Movie from "../models/movie.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._NOT_PERSONAL_RATING = 0;
    this._SHAKE_ANIMATION_TIMEOUT = 600;

    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._popupComponent = null;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._api = api;
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(card);

    const onClickHandler = () => {
      this._onViewChange();
      render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
      this._mode = Mode.EDIT;
    };

    this._filmCardComponent.setClickHandler(`.film-card__poster`, onClickHandler);
    this._filmCardComponent.setClickHandler(`.film-card__title`, onClickHandler);
    this._filmCardComponent.setClickHandler(`.film-card__comments`, onClickHandler);

    this._filmCardComponent.setAddToWatchlistClickHandler(() => {
      const newData = Movie.clone(card);
      newData.isAddToWatchList = !newData.isAddToWatchList;
      this._onDataChange(this, card, newData);
    });

    this._filmCardComponent.setAlreadyWatchedClickHandler(() => {
      const newData = Movie.clone(card);
      newData.isWatched = !newData.isWatched;
      this._onDataChange(this, card, newData);
    });

    this._filmCardComponent.setAddToFavoriteHandler(() => {
      const newData = Movie.clone(card);
      newData.isFavorite = !newData.isFavorite;
      this._onDataChange(this, card, newData);
    });

    this._api.getComment(card.id)
        .then((comments) => {
          this._popupComponent = new PopupComponent(card, comments);
          this._setPopupHandlers(card);
          if (oldFilmCardComponent && oldPopupComponent) {
            replace(this._filmCardComponent, oldFilmCardComponent);
            replace(this._popupComponent, oldPopupComponent);
          } else {
            render(this._container.getElement(), this._filmCardComponent, RenderPosition.BEFOREEND);
          }
        })
        .catch((err) => {
          throw err;
        });
  }

  _setPopupHandlers(card) {
    this._popupComponent.setAddToWatchlistClickHandler(() => {
      const newData = Movie.clone(card);
      newData.isAddToWatchList = !newData.isAddToWatchList;

      this._onDataChange(this, card, newData);
    });

    this._popupComponent.setAlreadyWatchedClickHandler(() => {
      const newData = Movie.clone(card);
      newData.isWatched = !newData.isWatched;
      newData.watchingDate = new Date().toISOString();

      if (!newData.isWatched) {
        newData.personalRating = this._NOT_PERSONAL_RATING;
      }

      this._onDataChange(this, card, newData);
    });

    this._popupComponent.setAddToFavoriteHandler(() => {
      const newData = Movie.clone(card);
      newData.isFavorite = !newData.isFavorite;

      this._onDataChange(this, card, newData);
    });

    this._popupComponent.setFilmUserRatingHandler((rating) => {
      const newData = Movie.clone(card);
      newData.personalRating = Number(rating);

      this._api.updateMovie(card.id, newData)
          .then((movie) => {
            this._onDataChange(this, movie, `personalRating`);
          }).catch(() => {
            const ratingElements = this._popupComponent.getElement().querySelectorAll(`.film-details__user-rating-input`);
            ratingElements.forEach((it) => {
              it.disabled = ``;
              it.checked = ``;
            });
          });
    });

    this._popupComponent.deleteFilmUserRatingHandler(() => {
      const newData = Movie.clone(card);
      newData.personalRating = this._NOT_PERSONAL_RATING;

      this._onDataChange(this, card, newData);
    });

    this._popupComponent.deleteCommentHandler((id) => {
      this._api.deleteComment(id)
          .then(() => {
            const newData = this._deleteCommentId(card, id);
            this._onDataChange(this, newData, null);
          })
          .catch((err) => {
            throw err;
          });
    });

    this._popupComponent.addCommentHandler((data) => {
      this._api.createComment(card.id, data)
          .then((movie) => {
            this._onDataChange(this, movie, null);
          })
          .catch(() => {
            this._shake();
          });
    });
  }

  _deleteCommentId(card, id) {
    const index = card.comments.findIndex((it) => it === id);

    if (index === -1) {
      return card;
    }

    card.comments = [].concat(card.comments.slice(0, index), card.comments.slice(index + 1));
    return card;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
  }

  _shake() {
    const element = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
    element.style.animation = `shake ${this._SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
      element.disabled = ``;
    }, this._SHAKE_ANIMATION_TIMEOUT);
  }
}
