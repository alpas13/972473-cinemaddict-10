import {createProfileTemplate} from './components/profile-name.js';
import {createNavigationTemplate} from './components/menu.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmsSectionTemplate} from './components/list.js';
import {createFilmsContainerTemplate} from './components/films-container.js';
import {createCardTemplate} from './components/card.js';
import {createShowMoreButtonTemplate} from './components/button-show-more.js';
import {createListExtraTemplate} from './components/list-extra.js';
import {createDetailCardTemplate} from './components/popup.js';
import {generateListOfFilmsCards} from "./mocks/film-card.js";
import {generateFiltersIndicators} from "./mocks/main-filter.js";
import {generateDetailFilmCard} from "./mocks/popup-data.js";
import {generateComments} from "./mocks/popup-data.js";

const TOTAL_CARDS = 16;
const TOTAL_EXTRA_CARDS = 2;
const SHOWING_CARD_COUNT_ON_START = 5;
const SHOWING_CARD_COUNT_BY_BUTTON = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};
const siteBodeElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate());

const filterData = generateFiltersIndicators();

render(siteMainElement, createNavigationTemplate(filterData));
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createFilmsSectionTemplate());

const filmsMainElement = document.querySelector(`.films`);
const filmsListElement = filmsMainElement.querySelector(`.films-list`);

render(filmsListElement, createFilmsContainerTemplate());
render(filmsMainElement, createListExtraTemplate(`Top rated`));
render(filmsMainElement, createListExtraTemplate(`Most commented`));

const filmsListContainer = filmsListElement.querySelector(`.films-list__container`);

const generalCardsData = generateListOfFilmsCards(TOTAL_CARDS);
let showingCardCount = SHOWING_CARD_COUNT_ON_START;

generalCardsData.slice(0, showingCardCount).forEach((card) => {
  render(filmsListContainer, createCardTemplate(card));
});

const filmsListExtra = filmsMainElement.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((value) => {
  render(value, createFilmsContainerTemplate());
  const filmsListExtraContainer = value.querySelector(`.films-list__container`);
  const extraCardsData = generateListOfFilmsCards(TOTAL_EXTRA_CARDS);
  extraCardsData.slice().forEach((card) => {
    render(filmsListExtraContainer, createCardTemplate(card));
  });
});

render(filmsListElement, createShowMoreButtonTemplate());

const buttonShowMore = filmsListElement.querySelector(`.films-list__show-more`);

buttonShowMore.addEventListener(`click`, () => {
  let prevCardCount = showingCardCount;
  showingCardCount += SHOWING_CARD_COUNT_BY_BUTTON;

  generalCardsData.slice(prevCardCount, showingCardCount).forEach((card) => {
    render(filmsListContainer, createCardTemplate(card));
  });

  if (showingCardCount >= generalCardsData.length) {
    buttonShowMore.remove();
  }
});
//render(siteBodeElement, createDetailCardTemplate(generateDetailFilmCard(), generateComments()));
