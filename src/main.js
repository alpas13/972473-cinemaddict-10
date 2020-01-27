import API from "./api.js";
import ProfileComponent from './components/profile-name.js';
import FilmsComponent from './components/films.js';
import PageController from "./controller/page-controller.js";
import MoviesModel from "./models/movies.js";
import FilterController from "./controller/filter.js";
import {render, RenderPosition} from "./utils/render.js";

export const AUTHORIZATION = `Basic kBwYd2o=XN9yZAzdXNlc`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);

render(siteHeaderElement, new ProfileComponent(), RenderPosition.BEFOREEND);

const moviesModel = new MoviesModel();

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const filmsComponent = new FilmsComponent();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent.getElement(), moviesModel, api);

api.getMovies()
    .then((movies) => {
      moviesModel.setMovies(movies);
      pageController.render();
    });
