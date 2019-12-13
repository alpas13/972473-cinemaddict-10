import AbstractComponent from "./abstract-component.js";

export default class Menu extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
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
}
