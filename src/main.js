import ProfileComponent from './components/profile-name.js';
import MenuComponent from './components/menu.js';
import FilmsComponent from './components/films.js';
import PageController from "./controller/page-controller.js";
import {generateListOfFilmsCards} from "./mocks/film-card.js";
import {generateFiltersIndicators} from "./mocks/main-filter.js";
import {render, RenderPosition} from "./utils/render";

const TOTAL_CARDS = 16;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);

const filterData = generateFiltersIndicators();
const filmsComponent = new FilmsComponent();

render(siteMainElement, new MenuComponent(filterData), RenderPosition.BEFOREEND);
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const generalCardsData = generateListOfFilmsCards(TOTAL_CARDS);

const pageController = new PageController(filmsComponent.getElement());

pageController.render(generalCardsData);
