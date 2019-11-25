import {createProfileTemplate} from './components/profile-name.js';
import {createNavigationTemplate} from './components/menu.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmsSectionTemplate} from './components/list.js';
import {createFilmsContainerTemplate} from './components/films-container.js';
import {createCardTemplate} from './components/card.js';
import {createShowMoreButtonTemplate} from './components/button-show-more.js';
import {createListExtraTemplate} from './components/list-extra.js';
import {createDetailCardTemplate} from './components/popup.js';

const TOTAL_CARDS = 5;
const TOTAL_EXTRA_CARDS = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const multipleRender = (iteration, container, template) => {
  new Array(iteration).fill(``).forEach(() => {
    render(container, template);
  });
};
const siteBodeElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createNavigationTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsMainElement = document.querySelector(`.films`);
const filmsListElement = filmsMainElement.querySelector(`.films-list`);

render(filmsListElement, createFilmsContainerTemplate());
render(filmsMainElement, createListExtraTemplate(`Top rated`));
render(filmsMainElement, createListExtraTemplate(`Most commented`));

const filmsListEContainer = filmsListElement.querySelector(`.films-list__container`);

multipleRender(TOTAL_CARDS, filmsListEContainer, createCardTemplate());

const filmsListExtra = filmsMainElement.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((value) => {
  render(value, createFilmsContainerTemplate());
  const filmsListExtraContainer = value.querySelector(`.films-list__container`);
  multipleRender(TOTAL_EXTRA_CARDS, filmsListExtraContainer, createCardTemplate());
});

render(filmsListElement, createShowMoreButtonTemplate());
render(siteBodeElement, createDetailCardTemplate());
