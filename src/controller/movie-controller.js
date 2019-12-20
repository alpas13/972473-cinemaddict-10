import FilmCardComponent from "../components/card";
import PopupComponent from "../components/popup";
import {generateComments, generateDetailFilmCard} from "../mocks/popup-data";
import {render, replace, RenderPosition, remove} from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._filmCardComponent = null;
    this._popupComponent = null;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardComponent(card);
    this._popupComponent = new PopupComponent(generateDetailFilmCard(), generateComments());

    const onClickHandler = () => {
      this._onViewChange();
      render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
      this._mode = Mode.EDIT;
    };

    this._filmCardComponent.setClickHandler(`.film-card__poster`, onClickHandler);
    this._filmCardComponent.setClickHandler(`.film-card__title`, onClickHandler);
    this._filmCardComponent.setClickHandler(`.film-card__comments`, onClickHandler);

    this._filmCardComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isAddToWatchList: !card.isAddToWatchList,
      }));
    });

    this._filmCardComponent.setAlreadyWatchedClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });

    this._filmCardComponent.setAddToFavorite(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    if (oldFilmCardComponent && oldPopupComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container.getElement(), this._filmCardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }
}
