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
  }

  getTemplate() {
    return (`<nav class="main-navigation">
    ${this._filters.map((value) => {
        return `<a href="#${value.name.toLowerCase()}" class="main-navigation__item ${this._activeFilterType === value.name ? `main-navigation__item--active` : ``}">
         ${value.name === `All` ? `All movies` : value.name}${value.name !== `All` ? `<span class="main-navigation__item-count">${value.count}</span>` : ``}</a>`;
      }).join(`\n`)}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
    );
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._setFilterChangeHandler);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (!evt.target.classList.contains(`main-navigation__item`)) {
        return;
      }
      const filterName = this._getFilterNameByHash(evt.target.hash);
      if (filterName !== `Stats`) {
        handler(filterName);
        this._activeFilterType = filterName;
      }
      this.rerender();
    });
    this._setFilterChangeHandler = handler;
  }

  _getFilterNameByHash(hash) {
    let filterName = ``;
    const firstLetter = hash.substring(1, 2).toUpperCase();
    return filterName.concat(firstLetter, hash.substring(2));
  }

  statShowClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.classList.contains(`main-navigation__item--additional`)) {
        handler(MenuItem.STATISTICS);
      } else if (evt.target.classList.contains(`main-navigation__item--active`)) {
        handler(MenuItem.ALL_MOVIES);
      }
    });
  }
}
