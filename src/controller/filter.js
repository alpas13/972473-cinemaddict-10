import MenuComponent from '../components/menu.js';
import {render, RenderPosition} from "../utils/render.js";
import {FilterType, getFilters} from "../utils/filter";
import {replace} from "../utils/render.js";

export default class Filter {
  constructor(container, moviesModel) {
    this._container = container;
    this._movies = moviesModel;
    this._menuComponent = null;
    this._menuItem = null;
    this._setOnChange = null;
    this._activeFilterType = FilterType.ALL;
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._movies.setDataChangeHandlers(this._onDataChange);
  }

  render() {
    this._allMovies = this._movies.getAllMovies();
    const filters = getFilters(this._allMovies);

    const oldComponent = this._menuComponent;

    this._menuComponent = new MenuComponent(filters, this._activeFilterType);
    this._menuComponent.setFilterChangeHandler(this._onFilterChange);
    this._menuComponent.statShowClickHandler((menuItem) => {
      this._menuItem = menuItem;
      this.setOnChange(this._setOnChange);
    });

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(this._container, this._menuComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._movies.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  setOnChange(handler) {
    handler(this._menuItem);
    this._setOnChange = handler;
  }
}
