import MenuComponent from '../components/menu.js';
import {render, RenderPosition} from "../utils/render.js";
import {FilterType, getMoviesByFilter} from "../utils/filter";
import {replace} from "../utils/render.js";

export default class Filter {
  constructor(container, moviesModel) {
    this._container = container;
    this._movies = moviesModel;
    this._menuComponent = null;
    this._activeFilterType = FilterType.ALL;
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._movies.setDataChangeHandlers(this._onDataChange);
  }

  render() {
    this._allMovies = this._movies.getAllMovies();
    const filters = this._getFilters(this._allMovies);

    const oldComponent = this._menuComponent;

    this._menuComponent = new MenuComponent(filters);
    this._menuComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(this._container, this._menuComponent, RenderPosition.BEFOREEND);
    }
  }

  _getFilters(movies) {
    return Object.values(FilterType)
        .map((filter) => {
          return {
            name: filter,
            count: getMoviesByFilter(movies, filter).length,
          };
        });
  }

  _onFilterChange(filterType) {
    this._movies.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
