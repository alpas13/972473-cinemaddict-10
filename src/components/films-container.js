import AbstractComponent from "./abstract-component.js";

export default class FilmsContainer extends AbstractComponent {
  getTemplate() {
    return (
      `<div class="films-list__container"></div>`
    );
  }
}
