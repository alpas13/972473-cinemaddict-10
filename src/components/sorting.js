import AbstractComponent from "./abstract-component.js";

export default class Sorting extends AbstractComponent {
  constructor() {
    super();

    this.SortType = {
      DEFAULT: `default`,
      DATE: `date`,
      RATING: `rating`,
    };

    this._activeSortType = this.SortType.DEFAULT;
  }

  getTemplate() {
    return (
      `<ul class="sort">
      <li><a href="#" data-sort-type="${this.SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${this.SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${this.SortType.RATING}" class="sort__button">Sort by rating</a></li>
      </ul>`
    );
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const sortType = evt.target.dataset.sortType;

      if (evt.target.tagName !== `A`) {
        return;
      }

      if (sortType === this._activeSortType) {
        return;
      }

      this._activeSortType = sortType;
      this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
      evt.target.classList.add(`sort__button--active`);
      handler(sortType);
    });
  }
}
