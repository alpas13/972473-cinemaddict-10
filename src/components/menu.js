import AbstractComponent from "./abstract-component.js";

export default class Menu extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return (`<nav class="main-navigation">
    ${this._filters.map((value) => {
        if (value.name === `All`) {
          return `<a href="#${value.name.toLowerCase()}" class="main-navigation__item main-navigation__item--active">All movies</a>`;
        } else {
          return `<a href="#${value.name.toLowerCase()}" class="main-navigation__item">
         ${value.name} <span class="main-navigation__item-count">
         ${value.count}</span></a>`;
        }
      }).join(`\n`)}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
    );
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterName = this._getFilterNameByHash(evt.target.hash);
      if (filterName !== `Stats`) {
        handler(filterName);
      }
      this.getElement().querySelectorAll(`.main-navigation__item`)
          .forEach((it) => it.classList.remove(`main-navigation__item--active`));
      evt.target.classList.add(`main-navigation__item--active`);
    });
  }

  _getFilterNameByHash(hash) {
    let filterName = ``;
    const firstLetter = hash.substring(1, 2).toUpperCase();
    return filterName.concat(firstLetter, hash.substring(2));
  }
}
