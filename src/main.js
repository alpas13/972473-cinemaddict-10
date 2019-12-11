import ProfileComponent from './components/profile-name.js';
import MenuComponent from './components/menu.js';
import SortingComponent from './components/sorting.js';
import FilmsListComponent from './components/list.js';
import FilmsContainerComponent from './components/films-container.js';
import FilmCardComponent from './components/card.js';
import ButtonShowMoreComponent from './components/button-show-more.js';
import ExtraFilmsListComponent from './components/list-extra.js';
import PopupComponent from './components/popup.js';
import {generateListOfFilmsCards} from "./mocks/film-card.js";
import {generateFiltersIndicators} from "./mocks/main-filter.js";
import {generateDetailFilmCard} from "./mocks/popup-data.js";
import {generateComments} from "./mocks/popup-data.js";
import {render, remove, RenderPosition} from "./utils/render";

const TOTAL_CARDS = 16;
const TOTAL_EXTRA_CARDS = 2;
const SHOWING_CARD_COUNT_ON_START = 5;
const SHOWING_CARD_COUNT_BY_BUTTON = 5;

const renderFilmCard = (container, card) => {
  const filmCardComponent = new FilmCardComponent(card);
  const popupComponent = new PopupComponent(generateDetailFilmCard(), generateComments());

  const cardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
  const cardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
  const cardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);
  const popupCloseButton = popupComponent.getElement().querySelector(`.film-details__close-btn`);

  [cardPoster, cardTitle, cardComments].map((value) => {
    return value.addEventListener(`click`, () => {
      render(siteBodeElement, popupComponent.getElement(), RenderPosition.BEFOREEND);
    });
  });

  popupCloseButton.addEventListener(`click`, () => {
    remove(popupComponent);
  });

  render(container, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteBodeElement = document.querySelector(`body`);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent().getElement(), RenderPosition.BEFOREEND);

const filterData = generateFiltersIndicators();
const filmListComponent = new FilmsListComponent();

render(siteMainElement, new MenuComponent(filterData).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, filmListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsMainElement = filmListComponent.getElement();
const filmsListElement = filmsMainElement.querySelector(`.films-list`);

const topRatedContainer = new ExtraFilmsListComponent(`Top rated`);
const mostCommentContainer = new ExtraFilmsListComponent(`Most commented`);

const filmsContainer = new FilmsContainerComponent();

render(filmsListElement, filmsContainer.getElement(), RenderPosition.BEFOREEND);
render(filmsMainElement, topRatedContainer.getElement(), RenderPosition.BEFOREEND);
render(filmsMainElement, mostCommentContainer.getElement(), RenderPosition.BEFOREEND);

const filmsListContainer = filmsContainer.getElement();

const generalCardsData = generateListOfFilmsCards(TOTAL_CARDS);
let showingCardCount = SHOWING_CARD_COUNT_ON_START;

generalCardsData.slice(0, showingCardCount).forEach((card) => {
  renderFilmCard(filmsListContainer, card);
});

const filmsListExtra = filmsMainElement.querySelectorAll(`.films-list--extra`);

filmsListExtra.forEach((value) => {
  render(value, new FilmsContainerComponent().getElement(), RenderPosition.BEFOREEND);
  const filmsListExtraContainer = value.querySelector(`.films-list__container`);
  const extraCardsData = generateListOfFilmsCards(TOTAL_EXTRA_CARDS);
  extraCardsData.slice().forEach((card) => {
    renderFilmCard(filmsListExtraContainer, card);
  });
});

const buttonShowMore = new ButtonShowMoreComponent();

render(filmsListElement, buttonShowMore.getElement(), RenderPosition.BEFOREEND);

buttonShowMore.getElement().addEventListener(`click`, () => {
  let prevCardCount = showingCardCount;
  showingCardCount += SHOWING_CARD_COUNT_BY_BUTTON;

  generalCardsData.slice(prevCardCount, showingCardCount).forEach((card) => {
    renderFilmCard(filmsListContainer, card);
  });

  if (showingCardCount >= generalCardsData.length) {
    remove(buttonShowMore);
    buttonShowMore.removeElement();
  }
});
