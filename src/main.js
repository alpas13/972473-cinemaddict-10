import ProfileComponent from './components/profile-name.js';
import FilmsComponent from './components/films.js';
import PageController from "./controller/page-controller.js";
import MoviesModel from "./models/movies.js";
import FilterController from "./controller/filter.js";
import {generateListOfFilmsCards} from "./mocks/film-card.js";
import {render, RenderPosition} from "./utils/render.js";

const TOTAL_CARDS = 16;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);

const moviesModel = new MoviesModel();
moviesModel.setMovies(generateListOfFilmsCards(TOTAL_CARDS));

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent.getElement(), moviesModel);

pageController.render();
