import {createProfileTemplate} from './components/profile-name.js';
import {createNavigationTemplate} from './components/menu.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmsSectionTemplate} from './components/list.js';
import {createCardTemplate} from './components/card.js';
import {createShowMoreButtonTemplate} from './components/button-show-more.js';
import {createDetailCardTemplate} from './components/popup.js';

const TOTAL_CARDS = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const siteBodeElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate());
render(siteMainElement, createNavigationTemplate());
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsListElement = document.querySelector(`.films-list`);
const filmsListEContainer = filmsListElement.querySelector(`.films-list__container`);
new Array(TOTAL_CARDS).fill(``).forEach(() => {
  render(filmsListEContainer, createCardTemplate());
});

render(filmsListElement, createShowMoreButtonTemplate());
render(siteBodeElement, createDetailCardTemplate());
