import SortingComponent from "../components/sorting.js";
import {render, RenderPosition} from "../utils/render.js";

export default class SortController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._sortingComponent = new SortingComponent();
    this._sortedCards = [];
    this._sortingChangeHandler = null;
    this._SHOWING_CARD_COUNT_ON_START = 5;

    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange.bind(this));
  }

  render() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
  }


  _onSortTypeChange(sortType) {
    const movies = this._moviesModel.getMovies();

    switch (sortType) {
      case this._sortingComponent.SortType.DATE:
        this._sortedCards = movies.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case this._sortingComponent.SortType.RATING:
        this._sortedCards = movies.slice().sort((a, b) => b.totalRating - a.totalRating);
        break;
      case this._sortingComponent.SortType.DEFAULT:
        this._sortedCards = movies.slice(0, this._SHOWING_CARD_COUNT_ON_START);
        break;
    }

    this._sortingChangeHandler(this._sortedCards);
  }

  setSortingChangeHandlers(handler) {
    this._sortingChangeHandler = handler;
  }
}


