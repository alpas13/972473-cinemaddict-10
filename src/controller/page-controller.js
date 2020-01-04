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
    this._showedMovieControllers = [];
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
    const filmsList = new FilmsList();
    const nonFilms = new NonFilms();
    const topRatedFilms = new ExtraFilmsList(`Top rated`);
    const mostCommentFilms = new ExtraFilmsList(`Most commented`);
    const generalFilmsContainer = new FilmsContainer();
    const buttonShowMore = new ButtonShowMore();

    let showingCardCount = this._SHOWING_CARD_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    render(this._container, filmsList, RenderPosition.BEFOREEND);

    if (!this._cards.length) {
      render(filmsList.getElement(), nonFilms, RenderPosition.BEFOREEND);
      return;
    }

    render(filmsList.getElement(), generalFilmsContainer, RenderPosition.BEFOREEND);

    let newData = this.renderFilmCards(generalFilmsContainer, this._cards.slice(0, showingCardCount), this._onDataChange, this._onViewChange);
    this._showedMovieControllers = this._showedMovieControllers.concat(newData);

    render(filmsList.getElement(), buttonShowMore, RenderPosition.BEFOREEND);

    buttonShowMore.setClickHandler(() => {
      let prevCardCount = showingCardCount;
      showingCardCount += this._SHOWING_CARD_COUNT_BY_BUTTON;

      newData = this.renderFilmCards(generalFilmsContainer, this._cards.slice(prevCardCount, showingCardCount), this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newData);

      if (showingCardCount >= this._cards.length) {
        remove(buttonShowMore);
        buttonShowMore.removeElement();
      }
    });

    render(this._container, topRatedFilms, RenderPosition.BEFOREEND);
    const topRatedFilmsContainer = new FilmsContainer();
    render(topRatedFilms.getElement(), topRatedFilmsContainer, RenderPosition.BEFOREEND);

    const topRatedFilmsList = this._cards.slice()
        .sort((a, b) => {
          return b.title.rating - a.title.rating;
        })
        .filter((card) => card.title.rating > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    if (topRatedFilmsList.length > 0) {
      newData = this.renderFilmCards(topRatedFilmsContainer, topRatedFilmsList, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newData);
    }


    render(this._container, mostCommentFilms, RenderPosition.BEFOREEND);
    const mostCommentFilmsContainer = new FilmsContainer();
    render(mostCommentFilms.getElement(), mostCommentFilmsContainer, RenderPosition.BEFOREEND);

    const mostCommentFilmsList = this._cards.slice()
        .sort((a, b) => {
          return b.comments - a.comments;
        })
        .filter((card) => card.comments > 0)
        .slice(0, this._TOTAL_EXTRA_CARDS);

    if (mostCommentFilmsList.length > 0) {
      newData = this.renderFilmCards(mostCommentFilmsContainer, mostCommentFilmsList, this._onDataChange, this._onViewChange);
      this._showedMovieControllers = this._showedMovieControllers.concat(newData);
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    movieController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((popup) => {
      popup.setDefaultView();
    });
  }
}
