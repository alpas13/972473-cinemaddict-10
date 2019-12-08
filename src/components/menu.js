import {createElement} from "../utils";

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return (`<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${this._filters.map((value) => (
        `<a href="#${name.toLowerCase()}" class="main-navigation__item">
         ${value.name} <span class="main-navigation__item-count">
         ${value.count}</span></a>`
      )).join(`\n`)}
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
