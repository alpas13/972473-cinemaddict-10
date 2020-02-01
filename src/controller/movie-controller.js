import FilmCardComponent from "../components/film-card";
import PopupComponent from "../components/popup";
import {render, replace, RenderPosition, remove} from "../utils/render";
import Movie from "../models/movie";
import Comment from "../models/comment";

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
    this._comments = [];
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(card);
    this._popupComponent = new PopupComponent(card, this._comments);
    this._setPopupHandlers(card);

    const onClickHandler = () => {
      this._api.getComment(card.id)
          .then((comments) => {
            this._popupComponent = new PopupComponent(card, comments);
            this._setPopupHandlers(card);
            this._onViewChange();
            render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
            this._mode = Mode.EDIT;
            this._comments = comments;
          })
          .catch((err) => {
            throw err;
          });
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

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container.getElement(), this._filmCardComponent, RenderPosition.BEFOREEND);
    }
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
            this._comments = this._deleteCommentId(this._comments, id);
            const newData = this._deleteCommentId(card, id);
            this._onDataChange(this, newData, null);
          })
          .catch((err) => {
            this._popupComponent.rerender();
            throw err;
          });
    });

    this._popupComponent.addCommentHandler((data) => {
      this._api.createComment(card.id, data)
          .then((response) => {
            const movie = Movie.parseMovie(response.movie);
            this._comments = Comment.parseComments(response.comments);
            this._onDataChange(this, movie, null);
          })
          .catch(() => {
            this._shake();
          });
    });
  }

  _deleteCommentId(commentsData, id) {
    if (commentsData.comments) {
      const index = commentsData.comments.findIndex((it) => it === id);
      if (index === -1) {
        return commentsData;
      }

      commentsData.comments = [].concat(commentsData.comments.slice(0, index), commentsData.comments.slice(index + 1));
      return commentsData;
    } else {
      const index = commentsData.findIndex((it) => it.id === id);
      if (index === -1) {
        return commentsData;
      }

      commentsData = [].concat(commentsData.slice(0, index), commentsData.slice(index + 1));
      return commentsData;
    }

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
