import SortingComponent from '../components/sorting.js';
import FilmsList from "../components/list.js";
import ExtraFilmsList from "../components/list-extra.js";
import FilmsContainer from "../components/films-container.js";
import ButtonShowMore from "../components/button-show-more.js";
import MovieController from "./movie-controller.js";
import NonFilms from "../components/non-films.js";
import {render, remove, RenderPosition} from "../utils/render";

export default class PageController {
  constructor(container) {
    this._container = container;
    this._cards = [];
    this._TOTAL_EXTRA_CARDS = 2;
    this._SHOWING_CARD_COUNT_ON_START = 5;
    this._SHOWING_CARD_COUNT_BY_BUTTON = 5;
    this._newData = [];
    this._showedMovieControllers = [];
    this._showingCardCount = this._SHOWING_CARD_COUNT_ON_START;

    this._filmsList = new FilmsList();
    this._nonFilms = new NonFilms();
    this._topRatedFilms = new ExtraFilmsList(`Top rated`);
    this._mostCommentFilms = new ExtraFilmsList(`Most commented`);
    this._generalFilmsContainer = new FilmsContainer();
    this._sortingComponent = new SortingComponent();
    this._buttonShowMore = new ButtonShowMore();
    this._topRatedFilmsContainer = new FilmsContainer();
    this._mostCommentFilmsContainer = new FilmsContainer();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._removeGeneralCardsList = this._removeGeneralCardsList.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  renderFilmCards(container, cards, onDataChange, onViewChange) {
    return cards.map((card) => {
      const movieController = new MovieController(container, onDataChange, onViewChange);
      movieController.render(card);
      return movieController;
    });
  }

  render(cards) {
    this._cards = cards;

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsList, RenderPosition.BEFOREEND);

    if (!this._cards.length) {
      render(this._filmsList.getElement(), this._nonFilms, RenderPosition.BEFOREEND);
      return;
    }

    render(this._filmsList.getElement(), this._generalFilmsContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(this._generalFilmsContainer, this._cards.slice(0, this._showingCardCount));

    this._renderShowMoreButton();

    render(this._container, this._topRatedFilms, RenderPosition.BEFOREEND);
    this._renderTopRatedFilmsList(this._cards);

    render(this._container, this._mostCommentFilms, RenderPosition.BEFOREEND);
    this._renderMostCommentFilmsList(this._cards);
  }

  _renderFilmCards(container, cards) {
    this._newData = this.renderFilmCards(container, cards, this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newData);
    this._showingCardCount = this._showedMovieControllers.length;
  }

  _renderTopRatedFilmsList(cards) {
    remove(this._topRatedFilmsContainer);

    const topRatedFilmsList = cards.slice()
        .sort((a, b) => {
          return b.title.rating - a.title.rating;
        })
        .filter((card) => card.title.rating > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    render(this._topRatedFilms.getElement(), this._topRatedFilmsContainer, RenderPosition.BEFOREEND);

    if (topRatedFilmsList.length > 0) {
      this._renderFilmCards(this._topRatedFilmsContainer, topRatedFilmsList);
    }
  }

  _renderMostCommentFilmsList(cards) {
    remove(this._mostCommentFilmsContainer);

    const mostCommentFilmsList = cards.slice()
        .sort((a, b) => {
          return b.comments - a.comments;
        })
        .filter((card) => card.comments > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    render(this._mostCommentFilms.getElement(), this._mostCommentFilmsContainer, RenderPosition.BEFOREEND);

    if (mostCommentFilmsList.length > 0) {
      this._renderFilmCards(this._mostCommentFilmsContainer, mostCommentFilmsList);
    }
  }

  _renderShowMoreButton() {
    remove(this._buttonShowMore);
    this._buttonShowMore.removeElement();

    if (this._showingCardCount >= this._cards.length) {
      return;
    }

    render(this._filmsList.getElement(), this._buttonShowMore, RenderPosition.BEFOREEND);

    this._buttonShowMore.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    let prevCardCount = this._showingCardCount;
    this._showingCardCount += this._SHOWING_CARD_COUNT_BY_BUTTON;

    this._renderFilmCards(this._generalFilmsContainer, this._cards.slice(prevCardCount, this._showingCardCount));

    if (this._showingCardCount >= this._cards.length) {
      remove(this._buttonShowMore);
      this._buttonShowMore.removeElement();
    }
  }

  _removeGeneralCardsList() {
    this._showedMovieControllers.forEach((card) => card.destroy());
    this._showedMovieControllers = [];
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    movieController.render(this._cards[index]);
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];

    switch (sortType) {
      case this._sortingComponent.SortType.DATE:
        sortedCards = this._cards.slice().sort((a, b) => b.year - a.year);
        break;
      case this._sortingComponent.SortType.RATING:
        sortedCards = this._cards.slice().sort((a, b) => b.title.rating - a.title.rating);
        break;
      case this._sortingComponent.SortType.DEFAULT:
        sortedCards = this._cards.slice(0, this._SHOWING_CARD_COUNT_ON_START);
        break;
    }

    this._removeGeneralCardsList();

    this._renderFilmCards(this._generalFilmsContainer, sortedCards);

    if (sortType === this._sortingComponent.SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._buttonShowMore);
    }

    this._renderTopRatedFilmsList(sortedCards);
    this._renderMostCommentFilmsList(sortedCards);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((popup) => {
      popup.setDefaultView();
    });
  }
}
