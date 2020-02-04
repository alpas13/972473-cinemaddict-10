import AbstractSmartComponent from "./abstract-smart-component";

export const MenuItem = {
  STATISTICS: `main-navigation__item--additional`,
  ALL_MOVIES: `main-navigation__item--active`,
};

export default class Menu extends AbstractSmartComponent {
  constructor(filters, activeFilterType) {
    super();

    this._filters = filters;
    this._activeFilterType = activeFilterType;
    this._setFilterChangeHandler = null;
    this._statShowClickHandler = null;
  }

  getTemplate() {
    return (`<nav class="main-navigation">
    ${this._filters.map((value) => {
        return `<a href="#${value.name.toLowerCase()}" data-filter="${value.name}" class="main-navigation__item ${this._activeFilterType === value.name ? `main-navigation__item--active` : ``}">
         ${value.name === `All` ? `All movies` : value.name}${value.name !== `All` ? `<span class="main-navigation__item-count">${value.count}</span>` : ``}</a>`;
      }).join(`\n`)}
    <a href="#stats" data-filter="stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
    );
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._setFilterChangeHandler);
    this.statShowClickHandler(this._statShowClickHandler);
  }

  setFilterChangeHandler(handler) {
    this._setFilterChangeHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      if (!evt.target.classList.contains(`main-navigation__item`)) {
        return;
      }

      const filterName = evt.target.dataset.filter;
      if (filterName !== `stats`) {
        handler(filterName);
        this._activeFilterType = filterName;
      }
      this.rerender();
    });
  }

  statShowClickHandler(handler) {
    this._statShowClickHandler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.dataset.filter === `stats`) {
        handler(MenuItem.STATISTICS);
      } else if (evt.target.dataset.filter === `All`) {
        handler(MenuItem.ALL_MOVIES);
      }
    });
  }
}
