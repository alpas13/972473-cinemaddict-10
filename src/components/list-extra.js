import AbstractComponent from "./abstract-component";

export default class ExtraFilmsList extends AbstractComponent {
  constructor(title) {
    super();

    this._title = title;
  }

  getTemplate() {
    return (
      `<section class="films-list--extra">
       <h2 class="films-list__title">${this._title}</h2>
       </section>`
    );
  }
}
