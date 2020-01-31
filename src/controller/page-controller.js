import SortingComponent from '../components/sorting.js';
import FilmsList from "../components/list.js";
import ExtraFilmsList from "../components/list-extra.js";
import FilmsContainer from "../components/films-container.js";
import ButtonShowMore from "../components/button-show-more.js";
import MovieController from "./movie-controller.js";
import NonFilms from "../components/non-films.js";
import {render, remove, RenderPosition} from "../utils/render";

export default class PageController {
  constructor(container, moviesModel, api, filterController) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;
    this._filterController = filterController;
    this._TOTAL_EXTRA_CARDS = 2;
    this._SHOWING_CARD_COUNT_ON_START = 5;
    this._SHOWING_CARD_COUNT_BY_BUTTON = 5;
    this._newData = [];
    this._newExtraData = [];
    this._showedMovieControllers = [];
    this._showedExtraMovieControllers = [];
    this._showingCardCount = this._SHOWING_CARD_COUNT_ON_START;

    this._filmsList = new FilmsList();
    this._nonFilms = new NonFilms();
    this._topRatedFilms = new ExtraFilmsList(`Top rated`);
    this._mostCommentFilms = new ExtraFilmsList(`Most commented`);
    this._generalFilmsContainer = new FilmsContainer();
    this._sortingComponent = null;
    this._buttonShowMore = new ButtonShowMore();
    this._topRatedFilmsContainer = new FilmsContainer();
    this._mostCommentFilmsContainer = new FilmsContainer();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._removeGeneralCardsList = this._removeGeneralCardsList.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  renderFilmCards(container, cards, onDataChange, onViewChange, api) {
    return cards.map((card) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, api);
      movieController.render(card);
      return movieController;
    });
  }

  render() {
    const movies = this._moviesModel.getMovies();
    this._renderSortingComponent();
    render(this._container, this._filmsList, RenderPosition.BEFOREEND);

    if (!movies.length) {
      render(this._filmsList.getElement(), this._nonFilms, RenderPosition.BEFOREEND);
      return;
    }

    render(this._filmsList.getElement(), this._generalFilmsContainer, RenderPosition.BEFOREEND);

    this._renderFilmCards(this._generalFilmsContainer, movies.slice(0, this._showingCardCount));

    this._renderShowMoreButton(movies);

    render(this._container, this._topRatedFilms, RenderPosition.BEFOREEND);
    this._renderTopRatedFilmsList(movies);

    render(this._container, this._mostCommentFilms, RenderPosition.BEFOREEND);
    this._renderMostCommentFilmsList(movies);
  }

  _renderFilmCards(container, cards) {
    this._newData = this.renderFilmCards(container, cards, this._onDataChange, this._onViewChange, this._api);
    this._showedMovieControllers = this._showedMovieControllers.concat(this._newData);
  }

  _renderExtraFilmCards(container, cards) {
    this._newExtraData = this.renderFilmCards(container, cards, this._onDataChange, this._onViewChange, this._api);
    this._showedExtraMovieControllers = this._showedExtraMovieControllers.concat(this._newExtraData);
  }

  _renderTopRatedFilmsList(cards) {
    remove(this._topRatedFilmsContainer);

    const topRatedFilmsList = cards.slice()
        .sort((a, b) => b.totalRating - a.totalRating)
        .filter((movie) => Number(movie.totalRating) > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    render(this._topRatedFilms.getElement(), this._topRatedFilmsContainer, RenderPosition.BEFOREEND);

    if (topRatedFilmsList.length > 0) {
      this._renderExtraFilmCards(this._topRatedFilmsContainer, topRatedFilmsList);
    }
  }

  _renderMostCommentFilmsList(cards) {
    remove(this._mostCommentFilmsContainer);

    const mostCommentFilmsList = cards.slice()
        .sort((a, b) => {
          return b.comments.length - a.comments.length;
        })
        .filter((movie) => movie.comments.length > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    render(this._mostCommentFilms.getElement(), this._mostCommentFilmsContainer, RenderPosition.BEFOREEND);

    if (mostCommentFilmsList.length > 0) {
      this._renderExtraFilmCards(this._mostCommentFilmsContainer, mostCommentFilmsList);
    }
  }

  _renderShowMoreButton(movies) {
    remove(this._buttonShowMore);
    this._buttonShowMore.removeElement();

    if (this._showingCardCount >= this._moviesModel.getMovies().length) {
      return;
    }

    render(this._filmsList.getElement(), this._buttonShowMore, RenderPosition.BEFOREEND);

    this._buttonShowMore.setClickHandler(this._onShowMoreButtonClick.bind(this, movies));
  }

  _renderSortingComponent() {
    if (this._sortingComponent) {
      remove(this._sortingComponent);
      this._sortingComponent.removeElement();
    }
    this._sortingComponent = new SortingComponent();
    render(this._container, this._sortingComponent, RenderPosition.AFTERBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange.bind(this));
  }

  _onShowMoreButtonClick(movies) {
    let prevCardCount = this._showingCardCount;
    this._showingCardCount += this._SHOWING_CARD_COUNT_BY_BUTTON;

    this._renderFilmCards(this._generalFilmsContainer, movies.slice(prevCardCount, this._showingCardCount));

    if (this._showingCardCount >= movies.length) {
      remove(this._buttonShowMore);
      this._buttonShowMore.removeElement();
    }
  }

  _removeGeneralCardsList() {
    this._showedMovieControllers.forEach((movie) => movie.destroy());
    this._showedMovieControllers = [];
  }

  _removeExtraCardsList() {
    this._showedExtraMovieControllers.forEach((movie) => movie.destroy());
    this._showedExtraMovieControllers = [];
  }

  _onDataChange(movieController, oldData, newData) {
    if (newData === null) {
      this._moviesModel.updateMovie(oldData.id, oldData);
      movieController.render(oldData);
      this._removeExtraCardsList();
      this._renderTopRatedFilmsList(this._moviesModel.getMovies());
      this._renderMostCommentFilmsList(this._moviesModel.getMovies());
    } else if (newData === `personalRating`) {
      this._moviesModel.updateMovie(oldData.id, oldData);
      movieController.render(oldData);
    } else {
      this._api.updateMovie(oldData.id, newData)
          .then((movie) => {
            this._moviesModel.updateMovie(movie.id, movie);
            movieController.render(movie);
          }).catch((err) => {
            throw err;
          });
    }
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const movies = this._moviesModel.getMovies();
    this._showingCardCount = this._SHOWING_CARD_COUNT_ON_START;

    switch (sortType) {
      case this._sortingComponent.SortType.DATE:
        sortedCards = movies.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case this._sortingComponent.SortType.RATING:
        sortedCards = movies.slice().sort((a, b) => b.totalRating - a.totalRating);
        break;
      case this._sortingComponent.SortType.DEFAULT:
        sortedCards = movies.slice(0, this._SHOWING_CARD_COUNT_ON_START);
        break;
    }

    this._removeGeneralCardsList();
    this._removeExtraCardsList();

    this._renderFilmCards(this._generalFilmsContainer, sortedCards.slice(0, this._showingCardCount));

    this._renderShowMoreButton(sortedCards);

    this._renderTopRatedFilmsList(this._moviesModel.getMovies());
    this._renderMostCommentFilmsList(this._moviesModel.getMovies());
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((popup) => {
      popup.setDefaultView();
    });
    this._showedExtraMovieControllers.forEach((popup) => {
      popup.setDefaultView();
    });
  }

  _onFilterChange() {
    this._updateMoviesPage(this._SHOWING_CARD_COUNT_ON_START);
  }

  _updateMoviesPage(count) {
    this._showingCardCount = count;
    this._renderSortingComponent();
    this._removeGeneralCardsList();
    this._removeExtraCardsList();
    this._renderFilmCards(this._generalFilmsContainer, this._moviesModel.getMovies().slice(0, this._showingCardCount));
    this._renderShowMoreButton(this._moviesModel.getMovies());
    this._renderTopRatedFilmsList(this._moviesModel.getMovies());
    this._renderMostCommentFilmsList(this._moviesModel.getMovies());
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }
}
